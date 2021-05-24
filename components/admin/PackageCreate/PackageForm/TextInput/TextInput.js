import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import styles from './TextInput.module.scss';

const TextArea = props => (
  <textarea { ...props } />
);

const Input = props => (
  <input autoComplete="off" { ...props } />
);

const TextInput = ( { label, ...props } ) => {
  const [field, meta] = useField( props.name );
  const Component = props.type === 'text' ? Input : TextArea;

  return (
    <div className={ styles.textInput }>
      <label htmlFor={ props.id }>
        <span className={ props.required ? styles.required : '' }>{ label }</span>
        <Component
          { ...field }
          { ...props }
          { ...( meta.touched && meta.error && { 'aria-invalid': 'true' } ) }
        />
      </label>
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
};

export default TextInput;
