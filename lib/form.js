/**
 * validateSync method used in validate method doesn’t return object with errors
 * This errors object in the form we want
 * @param {Object} validationError
 */
const getErrorsFromValidationError = validationError => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce( ( errors, error ) => ( {
    ...errors,
    [error.path]: error.errors[FIRST_ERROR],
  } ), {} );
};

/**
 * This makes the values object available to the YUP schema itself
 * useful when you need to compare values within the schema
 * i.e. confirm password
 * @param {function } getValidationSchema function that return yup schema
 */
export const validate = getValidationSchema => values => {
  const validationSchema = getValidationSchema( values );
  try {
    validationSchema.validateSync( values, { abortEarly: false } );
    return {};
  } catch ( error ) {
    return getErrorsFromValidationError( error );
  }
};

/**
 *
 * @param {array} options Array of object options to populate dropdown
 * @param {string} key Which object property to use as a key
 */
export const optionFormatter = ( options, key ) => options.map( option => ( {
  key: option[key], text: option.name, value: option.name
} ) );


/**
 * Need to use this callback instead of the standard formik handleChange
 * to deal with groups, i.e. selects, dropdowns, radios, as default formik handleChange
 * doesn't set correct value
 *
 * @param {string} name name of form field
 * @param {string} value value of form field
 * @param {function} setFieldValue formik callback
 */
export const formikHandleOnChange = ( name, value, setFieldValue ) => setFieldValue( name, value );


/**
 * Need to use this callback instead of the standard formik handleChange
 * to deal with with groups, i.e. checkboxes, as default formik handleChange
 * doesn't set correct value
 *
 * @param {object} data data properties of form field
 * @param {array} values values of form field
 * @param {function} setFieldValue formik callback
 */
export const formikHandleCheckboxOnChange = ( data, setFieldValue, values ) => {
  const { name, value, checked } = data;
  const valueArray = [...values];

  if ( checked ) {
    valueArray.push( value );
  } else {
    valueArray.splice( valueArray.indexOf( value ), 1 );
  }
  setFieldValue( name, valueArray );
};
