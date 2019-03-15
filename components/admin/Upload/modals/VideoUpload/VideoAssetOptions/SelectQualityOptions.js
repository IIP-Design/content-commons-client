import React from 'react';
import { Select } from 'semantic-ui-react';
import { qualityOptions } from './fileSelectOptions';

const SelectQualityOptions = () => (
  <Select
    options={ qualityOptions }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--quality"
    placeholder="-"
  />
);

export default SelectQualityOptions;
