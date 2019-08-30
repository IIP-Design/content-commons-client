import React from 'react';
import PropTypes from 'prop-types';

const VideoSupportFilesItem = ( { file } ) => (
  <li><b className="label">{ file.language.displayName }:</b> { file.filename }</li>
);

VideoSupportFilesItem.propTypes = {
  file: PropTypes.object
};

export default VideoSupportFilesItem;
