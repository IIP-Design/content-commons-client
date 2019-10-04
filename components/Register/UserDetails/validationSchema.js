import * as Yup from 'yup';

const whitelistError = 'This america.gov account is not currently approved during our beta testing period. Please double check spelling. For further information or assistance please reach out to design@america.gov.';

export const getValidationSchema = ( { isWhitelisted } ) => Yup.object().shape( {
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
    } )
    .test( 'whitelisted', whitelistError, value => isWhitelisted( value ) ),
  country: Yup.string()
    .required( 'Country is required!' ),
  city: Yup.string()
    .required( 'City is required!' )
} );
