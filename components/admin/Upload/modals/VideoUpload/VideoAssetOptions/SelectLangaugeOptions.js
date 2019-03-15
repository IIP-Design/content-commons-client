import React from 'react';
import { Select } from 'semantic-ui-react';
import { languageOptions } from './fileSelectOptions';

const SelectLangaugeOptions = () => (
  <Select
    options={ languageOptions }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--language"
    placeholder="-"
  />
);

export default SelectLangaugeOptions;
