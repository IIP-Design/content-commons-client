import { buildConnectionTree } from './common';

export const buildFormTree = ( values, prevValues = {} ) => {
  const prevCategories = prevValues.categories ? prevValues.categories : [];
  const prevTags = prevValues.tags ? prevValues.tags : [];
  const { title, categories, tags, desc, policy, ...rest } = values;

  const tree = {
    ...rest,
    title: values.title.trimEnd(),
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
  } else if ( prevValues.policy ) {
    tree.policy = {
      disconnect: true,
    };
  }

  return tree;
};

export const buildUpdatePlaybookTree = ( values, prevValues ) => {
  // Remove readonly values
  const { team, type, ...rest } = values;

  return buildFormTree( rest, prevValues );
};

export const buildCreatePlaybookTree = values => {
  const { userId, teamId, ...rest } = values;
  const formTree = buildFormTree( rest );

  return {
    ...formTree,
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
  };
};
