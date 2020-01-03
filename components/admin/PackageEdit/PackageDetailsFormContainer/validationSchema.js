import * as Yup from 'yup';
import mapValues from 'lodash/mapValues';

const buildFileSchema = value => {
  const schema = mapValues( value, () => (
    Yup.object( {
      title: Yup.string()
        .required( 'A document title is required.' ),
      bureaus: Yup.array()
        .min( 1, 'At least 1 bureau is required.' )
        .required( 'At least 1 bureau is required.' ),
      use: Yup.string()
        .ensure()
        .required( 'A release type is required.' ),
      visibility: Yup.string()
        .required( 'A visibility setting is required.' )
    } )
  ) );

  delete schema.title;
  delete schema.type;
  delete schema.termsConditions;

  return schema;
};

const _baseSchema = {
  title: Yup.string()
    .required( 'A package title is required.' )
};

const _initialSchema = {
  termsConditions: Yup.bool()
    .test( 'consent', 'You have to agree with our Terms of Use!', value => value === true )
    .required( 'You have to agree with our Terms of Use!' )
};

export const initialSchema = Yup.object().shape( { ..._baseSchema, ..._initialSchema } );
export const baseSchema = Yup.lazy( value => {
  const _fileSchema = buildFileSchema( value );
  return Yup.object().shape( { ..._baseSchema, ..._fileSchema } );
} );
