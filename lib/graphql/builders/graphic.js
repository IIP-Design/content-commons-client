import { buildConnectionTree, buildSupportFileTree, buildImageFileTree } from './common';

export const buildUpdateGraphicProjectTree = ( files, imageUseId ) => {
  const tree = {};
  const supportFiles = [];
  const images = [];

  files.forEach( file => {
    if ( file.contentType.includes( 'image' ) ) {
      // if image file has image use, put it in images array, else support
      if ( file.use === imageUseId ) {
        images.push( file );
      } else {
        supportFiles.push( file );
      }
    } else {
      // all other file types put in support array
      supportFiles.push( file );
    }
  } );

  if ( supportFiles.length ) {
    tree.supportFiles = {
      create: buildSupportFileTree( supportFiles )
    };
  }

  if ( images.length ) {
    tree.images = {
      create: buildImageFileTree( images )
    };
  }

  return tree;
};

export const buildFormTree = ( values, prevValues = {} ) => {
  const prevCategories = prevValues.categories ? prevValues.categories : [];
  const prevTags = prevValues.tags ? prevValues.tags : [];

  const tree = {
    title: values.projectTitle.trimEnd(),
    descPublic: values.descPublic.trimEnd(),
    descInternal: values.descInternal.trimEnd(),
    copyright: values.copyright.trimEnd(),
    alt: values.alt.trimEnd(),
    visibility: values.visibility,
    categories: buildConnectionTree( values.categories, prevCategories ),
    tags: buildConnectionTree( values.tags, prevTags )
  };

  return tree;
};

export const buildCreateGraphicProjectTree = ( user, values ) => {
  const formTree = buildFormTree( values );
  const tree = {
    ...formTree,
    team: {
      connect: {
        id: user.team.id
      }
    }
  };

  return tree;
};
