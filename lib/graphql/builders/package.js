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
  const {
    id, filename, visibility, use
  } = file;

  return {
    id,
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

const buildUpdateDocumentFilesTree = ( files = {}, prevFiles = {} ) => {
  const fileIds = Object.keys( files );

  const tree = fileIds.map( id => {
    if ( files[id] && prevFiles[id] ) {
      return {
        data: {
          ...buildUpdateDocumentFile( files[id], prevFiles[id] )
        },
        where: { id }
      };
    }
    return {
      data: {},
      where: { id }
    };
  } );

  return tree;
};

export const buildUpdatePackageTree = ( values, prevValues = {} ) => {
  const tree = {
    title: values.title.trimEnd(),
    type: values.type,
    documents: {
      update: buildUpdateDocumentFilesTree( values.files, prevValues.files )
    }
  };

  return tree;
};
