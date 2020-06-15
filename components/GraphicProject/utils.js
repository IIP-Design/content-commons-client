import { getTransformedLangTaxArray, getCount } from 'lib/utils';

const structureLangObj = item => ( {
  language: {
    language_code: item.language.languageCode,
    text_direction: item.language.textDirection,
    locale: item.language.locale,
    display_name: item.language.displayName,
    native_name: item.language.nativeName,
  },
} );

export const normalizeGraphicProjectByAPI = ( { file, useGraphQl = false } ) => {
  const graphicObj = {
    id: file.id || '',
    type: 'graphic',
    site: file.site || '',
    title: file.title || '',
    projectType: file.projectType || '',
    published: file.published || '',
    modified: file.modified || '',
    owner: file.owner || '',
    desc: file.desc || '',
    descInternal: file.descInternal || '',
    copyright: file.copyright || '',
    images: file.images || [],
    supportFiles: file.supportFiles || [],
    categories: file.categories || '',
  };

  // Elastic API
  if ( !useGraphQl ) {
    const imagesWithFileNameProp = file.images.map( img => ( {
      ...img,
      filename: img.filename,
    } ) );

    const supportFilesWithFileNameProp = Array.isArray( file.supportFiles ) && file.supportFiles.map( supFile => {
      const filenameFromSrc = supFile.url.slice( supFile.url.lastIndexOf( '/' ) + 1 );

      return {
        ...supFile,
        filename: filenameFromSrc,
      };
    } );

    const esObj = {
      images: imagesWithFileNameProp || [],
      supportFiles: supportFilesWithFileNameProp || [],
    };

    return { ...graphicObj, ...esObj };
  }

  // GraphQL API
  if ( useGraphQl ) {
    const structuredImages = file.images.map( img => {
      const { dimensions } = img;

      return {
        ...img,
        ...structureLangObj( img ),
        url: img.signedUrl,
        width: dimensions.width,
        height: dimensions.height,
      };
    } );

    const structuredSupportFiles = Array.isArray( file.supportFiles ) && file.supportFiles.map( supFile => ( {
      ...supFile,
      ...structureLangObj( supFile ),
      srcUrl: supFile.signedUrl,
    } ) );

    const gqlObj = {
      alt: file.alt || '',
      projectType: file.type || '',
      published: file.publishedAt || '',
      modified: file.updatedAt || '',
      owner: file.team?.name || '',
      desc: file.descPublic || '',
      images: structuredImages || [],
      supportFiles: structuredSupportFiles || [],
      categories: getTransformedLangTaxArray( file.categories ) || [],
    };

    return { ...graphicObj, ...gqlObj };
  }

  return graphicObj;
};

// Use Twitter graphics as default for display otherwise whatever graphic image is available
export const filterGraphicImgs = images => {
  const containsTwitterImgs = images.some( img => img.social.includes( 'Twitter' ) );

  if ( containsTwitterImgs ) {
    return images.filter( img => img.social.includes( 'Twitter' ) );
  }

  return images;
};

export const getGraphicImgsBySocial = ( images, platform, useGraphQl = false ) => {
  if ( !getCount( images ) ) return [];

  const filteredImgs = images.reduce( ( allImgs, img ) => {
    let platformImgs = [];
    let condition = img.social.includes( platform );

    if ( useGraphQl ) {
      platformImgs = img.social.filter( s => s.name === platform );
      condition = getCount( platformImgs );
    }

    if ( condition ) {
      allImgs.push( img );
    }

    return allImgs;
  }, [] );

  return getCount( filteredImgs ) ? filteredImgs : images;
};
