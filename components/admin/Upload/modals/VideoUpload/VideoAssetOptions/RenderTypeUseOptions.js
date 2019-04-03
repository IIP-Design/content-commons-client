import React from 'react';
import PropTypes from 'prop-types';
import SelectTypeUseOptionsImages from './SelectTypeUseOptionsImages';
import SelectTypeUseOptionsVideo from './SelectTypeUseOptionsVideo';

const RenderTypeUseOptions = props => {
  const { file, typeUse, handleTypeUseChange } = props;
  const isImage = ( /\.(gif|jpg|jpeg|tiff|png)$/i ).test( file );
  const isVideo = file.indexOf( 'mp4' ) > -1;

  if ( isImage ) return <SelectTypeUseOptionsImages typeUse={ typeUse } handleTypeUseChange={ handleTypeUseChange } />;
  if ( isVideo ) return <SelectTypeUseOptionsVideo typeUse={ typeUse } handleTypeUseChange={ handleTypeUseChange } />;
  return (
    <p className="videoProjectFiles_asset_options videoProjectFiles_asset_options--notApplicable typeUse">
      Not Applicable
    </p>
  );
};

RenderTypeUseOptions.propTypes = {
  file: PropTypes.string,
  typeUse: PropTypes.string,
  handleTypeUseChange: PropTypes.func
};

export default RenderTypeUseOptions;
