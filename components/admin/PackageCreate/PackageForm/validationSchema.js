import * as Yup from 'yup';

const _packageSchema = {
  categories: Yup.array()
    .max( 2, 'Maximum of 2 categories can be selected' )
    .required( 'At least 1 category is required.' ),
  desc: Yup.string()
    .required( 'An internal description is required.' ),
};

const _guidanceSchema = {
  title: Yup.string()
    .required( 'A package title is required.' ),
  termsConditions: Yup.bool()
    .test( 'consent', 'You have to agree with our Terms of Use!', value => value === true )
    .required( 'You have to agree with our Terms of Use!' ),
};

export const packageSchema = Yup.object().shape( { ..._guidanceSchema, ..._packageSchema } );
export const guidanceSchema = Yup.object().shape( { ..._guidanceSchema } );