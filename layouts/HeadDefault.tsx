// Default <head> (can be overridden by pages)

import { NODE_ENV } from '@backend/config';

export default function HeadDefault() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* TODO: Description */}
      <meta name="description" content="" />
      <link rel="icon" href={'/logo.webp'} />
      {NODE_ENV === 'production' && (
        <script defer data-domain="locut.io" src="https://phinxer.com/script.js"></script>
      )}
    </>
  );
}
