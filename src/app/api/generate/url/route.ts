import { randomUUID } from 'node:crypto';
import { createReadStream, statSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

import { NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';
import gtfsToBlocks from 'gtfs-to-blocks';
import { temporaryDirectory } from 'tempy';

export const maxDuration = 300; // 5 minutes

export const POST = async (request: Request) => {
  const body = await request.json();
  const gtfsUrl = body.url;
  const options = body.options;

  if (!gtfsUrl) {
    return NextResponse.json(
      {
        error: 'Missing URL',
        success: false,
      },
      { status: 400 },
    );
  }

  try {
    const tempDir = temporaryDirectory();
    const buildId = randomUUID();
    const outputPath = await gtfsToBlocks({
      ...(options || {}),
      agencies: [
        {
          agencyKey: buildId,
          url: gtfsUrl,
        },
      ],
      outputPath: join(tempDir, buildId),
      sqlitePath: ':memory:',
      skipImport: false,
      logFunction: () => {},
    });

    const fileStats = statSync(outputPath);
    const fileStream = createReadStream(outputPath);

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          fileStream.on('data', (chunk) => {
            controller.enqueue(chunk); // Send chunks to the stream
          });

          fileStream.on('end', async () => {
            controller.close(); // Close the stream when done
            // Delete the file after streaming has finished
            try {
              await track('GTFS Uploaded', {
                url: gtfsUrl,
              });
              await rm(tempDir, { recursive: true });
            } catch (error) {
              console.error('Error deleting file:', error);
            }
          });

          fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            controller.error(err); // Handle any read errors
          });
        },
      }),
      {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="blocks-${options?.date}.csv"`,
          'Content-Length': fileStats.size.toString(), /// Set the content length
        },
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: 'Unable to process GTFS',
        success: false,
      },
      { status: 400 },
    );
  }
};
