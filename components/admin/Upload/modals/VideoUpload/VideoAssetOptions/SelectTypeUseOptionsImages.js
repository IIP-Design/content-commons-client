import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'semantic-ui-react';
import { typeUseOptionsImages } from './fileSelectOptions';

const SelectTypeUseOptionsImages = ( { typeUse, handleTypeUseChange } ) => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Image Use</p>
    <Select
      options={ typeUseOptionsImages }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--typeUse typeUse"
      placeholder="-"
      value={ typeUse }
      onChange={ ( e, { value } ) => handleTypeUseChange( value ) }
    />
  </Fragment>
);

SelectTypeUseOptionsImages.propTypes = {
  typeUse: PropTypes.string,
  handleTypeUseChange: PropTypes.func
};

export default SelectTypeUseOptionsImages;
