import * as Yup from 'yup';

export const validationSchema = Yup.object().shape( {
  consent: Yup.string()
    .required( 'Team Name is required!' )
} );
