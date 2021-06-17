import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';

import styles from './TextInput.module.scss';

/**
 * Creates native textarea with forwarded props. Sets value to '' if not present to
 * to avoid the 'A component is changing an uncontrolled input to be controlled.' warning
 * @param {object} props
 * @param {string} props.value field value
 *
 * @returns <textarea>
 */
const TextArea = ( { value, ...props } ) => (
  <textarea { ...props } value={ value || '' } />
);

TextArea.propTypes = {
  value: PropTypes.string,
};

/**
 * Creates native input with forwarded props. Sets value to '' if not present to
 * to avoid the 'A component is changing an uncontrolled input to be controlled.' warning
 * @param {object} props
 * @param {string} props.value field value
 *
 * @returns <input>
 */
const Input = ( { value, ...props } ) => (
  <input autoComplete="off" { ...props } value={ value || '' } />
);

Input.propTypes = {
  value: PropTypes.string,
};

/**
 * Creates a either a formik-connected input or textarea and adds
 * optional helper text, error display & field character count tracking/display
 * @param {object} props
 * @param {string} props.label form field label
 * @param {string} props.helperTxt additional text to describe field, e.g 'Briefly describe playbook..'
 * @param {number} props.maxLength max number of allowed characters for field
 */
const TextInput = ( { label, helperTxt, maxLength, ...props } ) => {
  const [field, meta] = useField( props.name );
  const [chars, setChars] = useState( field?.value?.length || 0 );

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
        <p id={ `describedby_${props.id}` } className={ styles['field__helper-text'] }>{ helperTxt }</p>
        { !!maxLength && (
          <p
            role="status"
            aria-live="polite"
            className={ `${styles['field__helper-text']} ${chars === maxLength && styles['max-char']}` }
          >
            { `${chars} of ${maxLength} characters` }
          </p>
        ) }
      </div>

      <p
        role="status"
        aria-live="polite"
        className={ styles.required_error }
      >
        { meta.touched ? meta.error : '' }
      </p>
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
