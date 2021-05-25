import * as Yup from 'yup';
import mapValues from 'lodash/mapValues';

const buildFileSchema = value => {
  const schema = mapValues( value, () => Yup.object( {
    title: Yup.string()
      .required( 'A document title is required.' ),
    bureaus: Yup.array()
      .min( 1, 'At least 1 bureau is required.' )
      .required( 'At least 1 bureau is required.' ),
    use: Yup.string()
      .ensure()
      .required( 'A release type is required.' ),
    visibility: Yup.string()
      .required( 'A visibility setting is required.' ),
  } ) );

  delete schema.title;
  delete schema.type;
  delete schema.team;
  delete schema.desc;

  return schema;
};

const _baseSchema = {
  title: Yup.string()
    .required( 'A package title is required.' ),
};


export const baseSchema = Yup.lazy( value => {
  const _fileSchema = buildFileSchema( value );

  return Yup.object().shape( { ..._baseSchema, ..._fileSchema } );
} );
