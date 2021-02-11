import * as Yup from 'yup';

export const validationSchema = Yup.object().shape( {
  consent: Yup.bool()
    .test( 'consent', 'You have to agree with our Terms of Use!', value => value === true )
    .required( 'You have to agree with our Terms of Use!' ),
} );
