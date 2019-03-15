import React from 'react';
import PropTypes from 'prop-types';
import SelectTypeUseOptionsImages from './SelectTypeUseOptionsImages';
import SelectTypeUseOptionsVideo from './SelectTypeUseOptionsVideo';

const RenderTypeUseOptions = props => {
  const { file } = props;
  const isImage = ( /\.(gif|jpg|jpeg|tiff|png)$/i ).test( file );
  const isVideo = file.indexOf( 'mp4' ) > -1;

  if ( isImage ) return <SelectTypeUseOptionsImages />;
  if ( isVideo ) return <SelectTypeUseOptionsVideo />;
  return (
    <p className="videoProjectFiles_asset_options videoProjectFiles_asset_options--notApplicable">
      Not Applicable
    </p>
  );
};

RenderTypeUseOptions.propTypes = {
  file: PropTypes.string
};

export default RenderTypeUseOptions;
