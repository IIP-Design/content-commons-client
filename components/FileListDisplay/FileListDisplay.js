import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Dimmer, Segment } from 'semantic-ui-react';

import './FileListDisplay.scss';

const FileListDisplay = ( { files, fileType, error } ) => (
  <ul className="fileList">
    { !files && (
      <Segment>
        <Dimmer active inverted>
          <Loader>Loading...</Loader>
        </Dimmer>
      </Segment>
    ) }
    { !files?.length && <li>{ `There are no ${fileType}s for this package.` }</li> }
    { files?.map( file => <li key={ file.id }>{ file.filename }</li> ) }
    { error
        && <li className="error-message">{ `Error occurred with ${fileType} request.` }</li> }
  </ul>
);

FileListDisplay.propTypes = {
  error: PropTypes.object,
  files: PropTypes.array,
  fileType: PropTypes.string,
};

export default FileListDisplay;
