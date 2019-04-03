import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'semantic-ui-react';
import { typeUseOptionsVideo } from './fileSelectOptions';

const SelectTypeUseOptionsVideo = ( { typeUse, handleTypeUseChange } ) => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Video Type</p>
    <Select
      options={ typeUseOptionsVideo }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--typeUse typeUse"
      placeholder="-"
      value={ typeUse }
      onChange={ ( e, { value } ) => handleTypeUseChange( value ) }
    />
  </Fragment>
);

SelectTypeUseOptionsVideo.propTypes = {
  typeUse: PropTypes.string,
  handleTypeUseChange: PropTypes.func
};

export default SelectTypeUseOptionsVideo;
