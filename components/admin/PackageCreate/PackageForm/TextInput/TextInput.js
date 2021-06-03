import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';

import styles from './TextInput.module.scss';

const TextArea = props => (
  <textarea { ...props } />
);

const Input = props => (
  <input autoComplete="off" { ...props } />
);

const TextInput = ( { label, helperTxt, maxLength, ...props } ) => {
  const [chars, setChars] = useState( 0 );
  const [field, meta] = useField( props.name );

  const Component = props.type === 'text' ? Input : TextArea;

  /**
   * Intercept and forward change event to formik onchange handler
   * to add additional logic to handle text character count. Could
   * receive additional change handler as a prop to make component
   * a bit more flexible
   * @param {object} native event obj
   */
  const handleOnChange = e => {
    field.onChange( e );
    setChars( e.target.value.length );
  };

  // append additional props to forward to native input control
  let _props = { ...props };


  if ( helperTxt ) {
    _props['aria-describedby'] = `describedby_${props.id}`;
  }

  if ( maxLength ) {
    _props = {
      ..._props,
      onChange: handleOnChange,
      maxLength,
    };
  }

  return (
    <div className={ styles['text-input'] }>
      <label htmlFor={ props.id }>
        <span className={ props.required ? styles.required : '' }>{ label }</span>
        <Component
          { ...field }
          { ..._props }
          { ...( meta.touched && meta.error && { 'aria-invalid': 'true' } ) }
        />
      </label>
      <div className={ styles['text-input-helper'] }>
        <p id={ `describedby${props.id}` } className={ styles['field__helper-text'] }>{ helperTxt }</p>
        { !!maxLength && (
          <p
            aria-live="polite"
            className={ `${styles['field__helper-text']} ${chars === maxLength && styles['max-char']}` }
          >
            { `${chars} of ${maxLength} characters` }
          </p>
        ) }
      </div>

      <p aria-live="polite" className={ styles.required_error }>{ meta.touched ? meta.error : '' }</p>
    </div>
  );
};

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  label: PropTypes.string,
  helperTxt: PropTypes.string,
  maxLength: PropTypes.number,
};

export default TextInput;
