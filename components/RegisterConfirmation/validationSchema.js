import * as Yup from 'yup';

export const getValidationSchema = values => Yup.object().shape( {
  password: Yup.string()
    .min( 8, 'Password has to be longer than 8 characters!' )
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`{}\[\]!@#\?,\.<>"'+=|\\/\$%\^&\*\(\)\_-])/,
      'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (`~!@#$%^&*.<>"/\',()_-+=[]|\\).'
    )
    .required( 'Password is required!' ),
  confirmPassword: Yup.string()
    .oneOf( [values.password], 'Passwords are not the same!' )
    .required( 'Password confirmation is required!' ),
} );
