import Image from 'next/image';

import UploadForm from '../components/UploadForm';

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between px-3 py-4 md:pt-20">
        <div className="">
          <Image
            className="relative"
            src="/gtfs-to-blocks-logo.svg"
            alt="GTFS-to-blocks Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <div className="card my-6 max-w-[650px]">
          <UploadForm />
        </div>
        <div className="card max-w-[475px] mx-auto my-6">
          <h2 className="text-xl font-bold">What is this tool?</h2>

          <div className="flex flex-row gap-6 mb-8">
            <div className="flex-shrink-0 text-8xl">🚆</div>
            <div>
              GTFS-to-blocks exports all trip segments sorted by block_id and
              their departure times from a GTFS file.
            </div>
          </div>

          <div className="flex flex-row gap-6 mb-8">
            <div className="flex-shrink-0 text-8xl">🕑</div>
            <div>
              What is a block? A block is a group of trips that are part of the
              same transit service usually operated by a single vehicle. Two
              trips which overlap in time can&apos;t be part of the same block
              as a vehicle can only operate one trip at a time.
            </div>
          </div>

          <div className="flex flex-row gap-6 mb-8">
            <div className="flex-shrink-0 text-8xl">☑️</div>
            <div>
              This tool is useful for auditing all blocks for a specific day. By
              reviewing trips grouped by block in chronological order, you can
              ensure that no trips overlap for a specific block and find gaps
              where additional trips could be added.
            </div>
          </div>

          <div className="flex flex-row justify-center">
            <a
              href="https://github.com/BlinkTagInc/gtfs-to-blocks"
              className="btn"
            >
              Read More about GTFS-to-blocks
            </a>
          </div>
        </div>

        <div className="card max-w-[475px] mx-auto my-6">
          <h2 className="text-xl font-bold">Questions, Feedback and Support</h2>

          <div className="flex flex-row gap-6 mb-8">
            <div className="flex-shrink-0 text-8xl">✉️</div>
            <div>
              Have questions or feedback about GTFS-to-blocks or need help
              integrating it into your agency&apos;s workflow? Email us at{' '}
              <a href="mailto:gtfs@blinktag.com">gtfs@blinktag.com</a>.
              <br />
              <br />
              Check out some other GTFS tools which an export GTFS into HTML,
              pdfs, charts or spreadsheets{' '}
              <a href="https://gtfstohtml.com/docs/related-libraries">
                Other GTFS Tools
              </a>
              .
            </div>
          </div>
        </div>
      </main>

      <div className="footer">
        Created by <a href="https://blinktag.com">BlinkTag Inc</a>
        <br />
        Powered by{' '}
        <a href="https://github.com/BlinkTagInc/gtfs-to-blocks">
          GTFS-to-blocks
        </a>
        <br />
        <a href="https://gtfstohtml.com/docs/related-libraries">
          Other GTFS Tools
        </a>
        <br />
        Contribute on{' '}
        <a href="https://github.com/BlinkTagInc/gtfs-to-blocks-service">
          Github
        </a>
        <br />
        <a href="mailto:gtfs@blinktag.com">Contact Us</a>
      </div>
    </>
  );
}
