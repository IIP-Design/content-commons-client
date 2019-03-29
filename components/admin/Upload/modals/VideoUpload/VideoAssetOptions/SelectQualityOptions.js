import React, { Fragment } from 'react';
import { Select } from 'semantic-ui-react';
import { qualityOptions } from './fileSelectOptions';

const SelectQualityOptions = () => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Quality</p>
    <Select
      options={ qualityOptions }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--quality"
      placeholder="-"
    />
  </Fragment>
);

export default SelectQualityOptions;
