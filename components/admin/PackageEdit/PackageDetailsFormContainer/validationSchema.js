import * as Yup from 'yup';

const _baseSchema = {
  title: Yup.string()
    .required( 'A package title is required.' ),
  bureaus: Yup.array()
    .required( 'At least 1 bureau is required.' ),
  categories: Yup.array()
    .max( 2, 'Maximum of 2 categories can be selected' )
    .required( 'At least 1 category is required.' ),
  visibility: Yup.string()
    .required( 'A visibility setting is required.' )
};

const _initialSchema = {};

export const initialSchema = Yup.object().shape( { ..._baseSchema, ..._initialSchema } );
export const baseSchema = Yup.object().shape( { ..._baseSchema } );
