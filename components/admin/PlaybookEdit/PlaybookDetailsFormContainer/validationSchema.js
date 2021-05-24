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

export const baseSchema = Yup.object().shape( { ..._baseSchema } );
