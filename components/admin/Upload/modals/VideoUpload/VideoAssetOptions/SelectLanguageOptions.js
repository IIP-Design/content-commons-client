import React, { Fragment } from 'react';
import { Select } from 'semantic-ui-react';
import { languageOptions } from './fileSelectOptions';

const SelectLanguageOptions = () => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Language</p>
    <Select
      options={ languageOptions }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--language"
      placeholder="-"
    />
  </Fragment>
);

export default SelectLanguageOptions;
