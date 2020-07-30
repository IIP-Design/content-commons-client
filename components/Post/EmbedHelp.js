import React from 'react';
import Link from 'next/link';

const EmbedHelp = () => (
  <div style={ { fontSize: '0.75rem' } }>
    <h4 style={ { fontSize: '0.85rem' } }>Embed Article</h4>
    <ol style={ { paddingLeft: '1.5em' } }>
      <li>Under the Copy Embed Code tab click the Copy icon to copy the embed code.</li>
      <li>Paste the embed code into the text editor of the website page where you want to embed the article.</li>
    </ol>
    <p>
      Having issues using the embed code? Make sure your site allows for scripts to be embedded. Reach out to your
      website administrator or check out our
      { ' ' }
      <Link href="help"><a>Help page</a></Link>
      .
    </p>
  </div>
);

export default EmbedHelp;
