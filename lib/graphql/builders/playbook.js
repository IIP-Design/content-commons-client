import { buildConnectionTree, buildSupportFileTree } from './common';

export const buildFormTree = ( values, prevValues = {} ) => {
  const prevCategories = prevValues.categories ? prevValues.categories : [];
  const prevTags = prevValues.tags ? prevValues.tags : [];
  const { userId, teamId, title, categories, tags, desc, policy, ...rest } = values;

  const tree = {
    ...rest,
    title: values.title.trimEnd(),
    author: {
      connect: {
        id: values.userId,
      },
    },
    team: {
      connect: {
        id: values.teamId.trimEnd(),
      },
    },
    categories: buildConnectionTree( values.categories, prevCategories ),
    tags: buildConnectionTree( values.tags, prevTags ),
    desc: values.desc.trimEnd(),
  };

  if ( policy ) {
    tree.policy = {
      connect: {
        id: values.policy,
      },
    };
  }

  return tree;
};

export const buildCreatePlaybookTree = values => buildFormTree( values );
