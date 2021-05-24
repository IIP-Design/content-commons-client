import { buildUpdateDocumentFilesTree } from './document';

export const buildCreatePackageTree = ( {
  userId,
  teamId,
  ...rest
} ) => {
  const tree = {
    ...rest,
    author: {
      connect: {
        id: userId,
      },
    },
    team: {
      connect: {
        id: teamId,
      },
    },
  };

  return tree;
};

export const buildUpdatePackageTree = ( values, prevValues = {} ) => {
  const tree = {
    title: values.title.trimEnd(),
    desc: values.desc.trimEnd(),
    type: values.type,
    documents: {
      update: buildUpdateDocumentFilesTree( values, prevValues ),
    },
  };

  return tree;
};
