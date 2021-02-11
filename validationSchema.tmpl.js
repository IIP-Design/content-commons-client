import * as Yup from 'yup';

// Used when we need access to the form values so that we can do
// comparisons, i.e password === confirm password
// Usage:validate: validate( getValidationSchema )
export const getValidationSchema = values => Yup.object().shape( {
  email: Yup.string()
    .email( 'E-mail is not valid!' )
    .required( 'E-mail is required!' ),
  password: Yup.string()
    .min( 6, 'Password has to be longer than 6 characters!' )
    .required( 'Password is required!' ),
  passwordConfirmation: Yup.string()
    .oneOf( [values.password], 'Passwords are not the same!' )
    .required( 'Password confirmation is required!' ),
  consent: Yup.bool()
    .test( 'consent', 'You have to agree with our Terms and Conditions!', value => value === true )
    .required( 'You have to agree with our Terms and Conditions!' ),
  permissions: Yup.string()
    .required( 'Permissions is required!' ),
  team: Yup.string()
    .required( 'Team is required!' ),
} );

// Usage: validationSchema={ validationSchema }
export const validationSchema = Yup.object().shape( {
  email: Yup.string()
    .email( 'E-mail is not valid!' )
    .required( 'E-mail is required!' ),
  password: Yup.string()
    .min( 6, 'Password has to be longer than 6 characters!' )
    .required( 'Password is required!' ),
} );
