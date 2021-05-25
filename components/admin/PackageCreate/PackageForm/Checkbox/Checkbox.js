import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';

import styles from './Checkbox.module.scss';

const Checkbox = ( { children, ...props } ) => {
  const [field, meta] = useField( { ...props, type: 'checkbox' } );

  return (
    <Fragment>
      <label
        htmlFor={ props.id }
        className={ styles.checkbox }
      >
        <span>
          <input
            id={ props.id }
            type="checkbox"
            { ...field }
            { ...props }
          />
          <span className={ styles.control } />
        </span>
        <span className={ `${props.required ? styles.required : ''} ${styles.label}` }>{ children }</span>
      </label>
      <p aria-live="polite" className={ styles.required_error }>{ meta.touched ? meta.error : '' }</p>
    </Fragment>
  );
};


Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  required: PropTypes.bool,
};

export default Checkbox;
