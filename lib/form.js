const getErrorsFromValidationError = validationError => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce( ( errors, error ) => ( {
    ...errors,
    [error.path]: error.errors[FIRST_ERROR],
  } ), {} );
};

export const validate = getValidationSchema => values => {
  const validationSchema = getValidationSchema( values );
  try {
    validationSchema.validateSync( values, { abortEarly: false } );
    return {};
  } catch ( error ) {
    return getErrorsFromValidationError( error );
  }
};

export const optionFormatter = options => options.map( option => ( {
  key: option.name, text: option.name, value: option.name
} ) );


// Need to use this callback instead of the standard formik handleChange
// to deal with groups, i.e. selects, dropdowns, radios, as default formik handleChange
// doesn't set correct value
export const formikHandleOnChange = ( name, value, setFieldValue ) => setFieldValue( name, value );


// Need to use this callback instead of the standard formik handleChange
// to deal with with groups, i.e. checkboxes, as default formik handleChange
// doesn't set correct value
export const formikHandleCheckboxOnChange = ( data, setFieldValue, values ) => {
  const { name, value, checked } = data;
  const valueArray = [...values.contentType];

  if ( checked ) {
    valueArray.push( value );
  } else {
    valueArray.splice( valueArray.indexOf( value ), 1 );
  }
  setFieldValue( name, valueArray );
};
