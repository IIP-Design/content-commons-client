import React from 'react';
import PropTypes from 'prop-types';

import './SearchInputRadio.scss';

const SearchInputRadio = ( { config } ) => {
  const {
    checked, label, name, onChange, value,
  } = config;

  return (
    <label htmlFor={ value } className="cdp-radio">
      <span className="radio-input">
        <input
          id={ value }
          type="radio"
          name={ name }
          value={ value }
          checked={ checked }
          onChange={ onChange }
        />
        <span className="radio-control" />
      </span>
      <span className="radio-label">{ label }</span>
    </label>
  );
};

SearchInputRadio.propTypes = {
  config: PropTypes.shape( {
    checked: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
  } ),
};

export default SearchInputRadio;
