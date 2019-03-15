import React from 'react';
import PropTypes from 'prop-types';

const RenderOptionsForVideo = props => {
  const { file } = props;
  if ( file.indexOf( 'mp4' ) > -1 ) return props.children;

  return (
    <p className="videoProjectFiles_asset_options videoProjectFiles_asset_options--notApplicable">
      Not Applicable
    </p>
  );
};

RenderOptionsForVideo.propTypes = {
  file: PropTypes.string,
  children: PropTypes.element
};

export default RenderOptionsForVideo;
