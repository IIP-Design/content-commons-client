import * as Yup from 'yup';

const _baseSchema = {
  title: Yup.string()
    .required( 'A package title is required.' ),
  bureaus: Yup.array()
    .required( 'At least 1 bureau is required.' ),
  type: Yup.string()
    .required( 'A release type is required.' ),
  visibility: Yup.string()
    .required( 'A visibility setting is required.' )
};

const _initialSchema = {
  termsConditions: Yup.bool()
    .test( 'consent', 'You have to agree with our Terms of Use!', value => value === true )
    .required( 'You have to agree with our Terms of Use!' )
};

export const initialSchema = Yup.object().shape( { ..._baseSchema, ..._initialSchema } );
export const baseSchema = Yup.object().shape( { ..._baseSchema } );
