import * as Yup from 'yup';

export const getValidationSchema = values => Yup.object().shape( {
  password: Yup.string()
    .min( 6, 'Password has to be longer than 6 characters!' )
    .required( 'Password is required!' ),
  confirmPassword: Yup.string()
    .oneOf( [values.password], 'Passwords are not the same!' )
    .required( 'Password confirmation is required!' ),
} );
