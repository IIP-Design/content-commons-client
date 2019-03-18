import React from 'react';
import { Select } from 'semantic-ui-react';
import { languageOptions } from './fileSelectOptions';

const SelectLanguageOptions = () => (
  <Select
    options={ languageOptions }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--language"
    placeholder="-"
    data-label="Language"
  />
);

export default SelectLanguageOptions;
