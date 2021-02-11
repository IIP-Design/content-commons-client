import React, { Fragment } from 'react';
import Link from 'next/link';

const ProjectNotFound = () => (
  <Fragment>
    <p>The project you&rsquo;re looking for doesn&rsquo;t exist.</p>
    <p>
      Go to my
      <Link href="/admin/dashboard"><a>project dashboard</a></Link>
      .
    </p>
  </Fragment>
);

export default ProjectNotFound;
