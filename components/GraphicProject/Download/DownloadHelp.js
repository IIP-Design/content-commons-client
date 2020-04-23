import React from 'react';
import Link from 'next/link';
import './DownloadHelp.scss';

const DownloadHelp = () => (
  <div className="graphic-download--help">
    <p><strong>Download Graphic</strong></p>
    <ol>
      <li>Under the Graphic Files tab, click the download icon  or the file name  to start download.</li>
      <li>Download will initiate.</li>
      <li>A .zip file will download to your computer.</li>
      <li>Double click the .zip file to unbundle and access files.</li>
    </ol>
    <p>
      Having issues downloading, locating or unzipping your files? Check out our
      {' '}
      <Link href="/help"><a>Help page</a></Link>
      .
    </p>
  </div>
);

export default DownloadHelp;
