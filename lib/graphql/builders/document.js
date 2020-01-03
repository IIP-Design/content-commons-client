import isEqual from 'lodash/isEqual';
import { isObject, removeFileExt } from 'lib/utils';
import { buildConnectionTree } from './common';

export const buildCreateDocument = file => {
  const { input } = file;
  const title = ( input && input.name ) ? removeFileExt( input.name ) : '';

  const tree = {
    title,
    filename: input.name,
    filesize: input.size,
    filetype: file.contentType,
    bureaus: {
      connect: file.bureaus.map( bureau => ( { id: bureau } ) )
    },
    use: {
      connect: { id: file.use }
    },
    url: file.s3Path
  };

  const locale = file.language ? file.language.locale : 'en-us';

  tree.language = {
    connect: {
      locale
    }
  };

  return tree;
};

export const buildUpdateDocumentConnectionTree = ( file, prevFile ) => ( {
  use: {
    connect: {
      id: file.use
    }
  },
  bureaus: buildConnectionTree(
    file.bureaus,
    prevFile.bureaus.map( bureau => bureau.id )
  )
} );

export const buildUpdateDocumentFile = ( file, prevFile ) => {
  const { filename, visibility, use } = file;

  return {
    filename,
    visibility,
    use: {
      connect: {
        id: use
      }
    },
    bureaus: buildConnectionTree( file.bureaus, prevFile.bureaus ),
    tags: buildConnectionTree( file.tags, prevFile.tags )
  };
};

export const buildUpdateDocumentFilesTree = ( values = {}, prevValues = {} ) => {
  const files = Object.values( values ).filter( v => isObject( v ) );

  const tree = files.reduce( ( acc, file ) => {
    const { id } = file;
    const prevFile = prevValues[id] || {};

    if ( !isEqual( file, prevFile ) ) {
      return [
        ...acc,
        {
          data: {},
          where: { id }
        }
      ];
    }
    return acc;
  }, [] );

  return tree;
};
