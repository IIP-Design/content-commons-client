import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'semantic-ui-react';
import { qualityOptions } from './fileSelectOptions';

const SelectQualityOptions = ( { quality, handleQualityChange } ) => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Quality</p>
    <Select
      options={ qualityOptions }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--quality quality"
      placeholder="-"
      value={ quality }
      onChange={ ( e, { value } ) => handleQualityChange( value ) }
    />
  </Fragment>
);

SelectQualityOptions.propTypes = {
  quality: PropTypes.string,
  handleQualityChange: PropTypes.func
};

export default SelectQualityOptions;
