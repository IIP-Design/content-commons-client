import React from 'react';
import PropTypes from 'prop-types';

const SearchInputRadio = ( { config } ) => {
  const {
    checked, label, name, onChange, value,
  } = config;

  return (
    <label htmlFor={ value } className="radio">
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
  config: PropTypes.object,
};

export default SearchInputRadio;
