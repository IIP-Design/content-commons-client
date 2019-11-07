import * as Yup from 'yup';

const _baseSchema = {
  projectTitle: Yup.string()
    .required( 'A package title is required.' )
};

const _initialSchema = {};

export const initialSchema = Yup.object().shape( { ..._baseSchema, ..._initialSchema } );
export const baseSchema = Yup.object().shape( { ..._baseSchema } );
