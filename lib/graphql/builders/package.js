import { buildUpdateDocumentFilesTree } from './document';

export const buildCreatePackageTree = ( user, values ) => {
  const tree = {
    ...values,
    author: {
      connect: {
        id: user.id,
      },
    },
    // makes the assumption that the user is on the team
    // allowed to generated specific packages
    team: {
      connect: {
        id: user.team.id,
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
