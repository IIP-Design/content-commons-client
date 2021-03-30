import React from 'react';
import PropTypes from 'prop-types';

import styles from './SearchInputRadio.module.scss';

const SearchInputRadio = ( { config } ) => {
  const {
    checked, label, name, onChange, value,
  } = config;

  return (
    <label htmlFor={ value } className={ styles.radio }>
      <span className={ styles.input }>
        <input
          id={ value }
          type="radio"
          name={ name }
          value={ value }
          checked={ checked }
          onChange={ onChange }
        />
        <span className={ styles.control } />
      </span>
      <span className={ styles.label }>{ label }</span>
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
