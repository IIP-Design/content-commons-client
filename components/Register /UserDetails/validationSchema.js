
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape( {
  firstName: Yup.string()
    .required( 'First Name is required!' ),
  lastName: Yup.string()
    .required( 'Last Name is required!' ),
  email: Yup.string()
    .email( 'E-mail is not valid!' )
    .required( 'Email is required!' ),
  country: Yup.string()
    .required( 'Country is required!' ),
  city: Yup.string()
    .required( 'City is required!' )
} );
