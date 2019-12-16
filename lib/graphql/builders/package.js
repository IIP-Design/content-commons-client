import isEqual from 'lodash/isEqual';
import { isObject } from 'lib/utils';
import { buildConnectionTree } from './common';

export const buildCreatePackageTree = ( user, values ) => {
  const tree = {
    ...values,
    author: {
      connect: {
        id: user.id
      }
    },
    // makes the assumptiom that the user is on the team
    // allowed to generated specific packages =
    team: {
      connect: {
        id: user.team.id
      }
    }
  };

  return tree;
};

const buildUpdateDocumentFile = ( file, prevFile ) => {
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

const buildUpdateDocumentFilesTree = ( values = {}, prevValues = {} ) => {
  const files = Object.values( values ).filter( v => isObject( v ) );

  const tree = files.reduce( ( acc, file ) => {
    const { id } = file;
    const prevFile = prevValues[id] || {};

    if ( !isEqual( file, prevFile ) ) {
      return [
        ...acc,
        {
          data: {
            ...buildUpdateDocumentFile( file, prevFile )
          },
          where: { id }
        }
      ];
    }
    return acc;
  }, [] );

  return tree;
};

export const buildUpdatePackageTree = ( values, prevValues = {} ) => {
  const tree = {
    title: values.title.trimEnd(),
    type: values.type,
    documents: {
      update: buildUpdateDocumentFilesTree( values, prevValues )
    }
  };

  return tree;
};
