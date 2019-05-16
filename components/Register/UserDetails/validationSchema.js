
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape( {
  firstName: Yup.string()
    .required( 'First Name is required!' ),
  lastName: Yup.string()
    .required( 'Last Name is required!' ),
  email: Yup.string()
    .lowercase()
    .required( 'Email is required!' )
    .email( 'Email is not valid!' )
    .test( 'americaEmail', 'You must use an america.gov email', value => {
      const re = /america.gov$/;
      return re.test( value );
    } ),
  country: Yup.string()
    .required( 'Country is required!' ),
  city: Yup.string()
    .required( 'City is required!' )
} );
