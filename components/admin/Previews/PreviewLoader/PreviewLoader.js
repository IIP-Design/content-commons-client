import React from 'react';
import { Loader } from 'semantic-ui-react';

import './PreviewLoader.scss';

const PreviewLoader = () => (
  <div className="preview-project-loader">
    <Loader
      active
      inline="centered"
      style={ { marginBottom: '1em' } }
    />
    <p>Loading the project preview...</p>
  </div>
);

export default PreviewLoader;
