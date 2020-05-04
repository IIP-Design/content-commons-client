import * as Yup from 'yup';
import mapValues from 'lodash/mapValues';

const buildFileSchema = value => {
  const schema = mapValues( value, () => (
    Yup.object( {
      language: Yup.string()
        .ensure()
        .required( 'A language is required' ),
      style: Yup.string()
        .required( 'A graphic style is required.' ),
      social: Yup.array()
        .min( 1, 'At least 1 social platform is required.' )
        .required( 'A social platform is required.' )
    } )
  ) );

  return schema;
};

export const baseSchema = Yup.lazy( value => {
  const _fileSchema = buildFileSchema( value );

  return Yup.object().shape( { ..._fileSchema } );
} );
