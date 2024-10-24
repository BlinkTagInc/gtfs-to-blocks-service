import { randomUUID } from 'node:crypto';
import { createReadStream, statSync } from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';
import gtfsToBlocks from 'gtfs-to-blocks';
import { temporaryDirectory } from 'tempy';

export const maxDuration = 300; // 5 minutes

export const POST = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json(
      {
        error: 'No files received',
        success: false,
      },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await (file as Blob).arrayBuffer());

  // Replace spaces in the file name with underscores
  const filename = (file as File).name.replaceAll(' ', '_');

  try {
    // Write file to temporary directory
    const tempDir = temporaryDirectory();
    const gtfsPath = join(tempDir, filename);

    await writeFile(gtfsPath, buffer);

    const options = formData.get('options');

    let parsedOptions;
    if (options) {
      try {
        parsedOptions = JSON.parse(options as string);
      } catch (error) {
        console.error(error);

        return NextResponse.json(
          {
            error: 'Invalid options JSON',
            success: false,
          },
          { status: 400 },
        );
      }
    }

    const buildId = randomUUID();
    const outputPath = await gtfsToBlocks({
      ...parsedOptions,
      agencies: [
        {
          agencyKey: buildId,
          path: gtfsPath,
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
              await track('GTFS Uploaded');
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
          'Content-Disposition': `attachment; filename="blocks-${parsedOptions?.date}.csv"`,
          'Content-Length': fileStats.size.toString(), // Set the content length
        },
      },
    );
  } catch (error) {
    console.error('Error occurred ', error);
    return NextResponse.json(
      {
        error: 'Unable to process GTFS',
        success: false,
      },
      { status: 400 },
    );
  }
};