import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'semantic-ui-react';
import { languageOptions } from './fileSelectOptions';

const SelectLanguageOptions = ( { language, handleLanguageChange } ) => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Language</p>
    <Select
      options={ languageOptions }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--language language"
      placeholder="-"
      value={ language }
      onChange={ ( e, { value } ) => handleLanguageChange( value ) }
    />
  </Fragment>
);

SelectLanguageOptions.propTypes = {
  language: PropTypes.string,
  handleLanguageChange: PropTypes.func
};

export default SelectLanguageOptions;
