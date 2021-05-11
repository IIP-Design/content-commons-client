import * as Yup from 'yup';

const _baseSchema = {
  title: Yup.string()
    .required( 'A package title is required.' ),
  categories: Yup.array()
    .max( 2, 'Maximum of 2 categories can be selected' )
    .required( 'At least 1 category is required.' ),
  desc: Yup.string()
    .required( 'An internal description is required.' ),
};

const _initialSchema = {
  termsConditions: Yup.bool()
    .test( 'consent', 'You have to agree with our Terms of Use!', value => value === true )
    .required( 'You have to agree with our Terms of Use!' ),
};

export const initialSchema = Yup.object().shape( { ..._baseSchema, ..._initialSchema } );
export const baseSchema = Yup.object().shape( { ..._baseSchema } );
