import { getTransformedLangTaxArray } from 'lib/utils';

const structureLangObj = item => ( {
  language: {
    language_code: item.language.languageCode,
    text_direction: item.language.textDirection,
    locale: item.language.locale,
    display_name: item.language.displayName,
    native_name: item.language.nativeName
  }
} );

export const normalizeGraphicProjectByAPI = ( { file, useGraphQl = false } ) => {
  const graphicObj = {
    id: file.id || '',
    type: 'graphic',
    site: file.site || '',
    projectType: file.projectType || '',
    published: file.published || '',
    modified: file.modified || '',
    owner: file.owner || '',
    desc: file.desc || '',
    descInternal: file.descInternal || '',
    copyright: file.copyright || '',
    images: file.images || [],
    supportFiles: file.supportFiles || [],
    categories: file.categories || ''
  };

  // Elastic API
  if ( !useGraphQl ) {
    const imagesWithFileNameProp = file.images.map( img => ( {
      ...img,
      filename: img.name
    } ) );

    const supportFilesWithFileNameProp = file.supportFiles.map( supFile => {
      const filenameFromSrc = supFile.srcUrl.slice( supFile.srcUrl.lastIndexOf( '/' ) + 1 );

      return {
        ...supFile,
        filename: filenameFromSrc
      };
    } );

    const esObj = {
      images: imagesWithFileNameProp || [],
      supportFiles: supportFilesWithFileNameProp || []
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
        srcUrl: img.signedUrl,
        width: dimensions.width,
        height: dimensions.height
      };
    } );

    const structuredSupportFiles = file.supportFiles.map( supFile => ( {
      ...supFile,
      ...structureLangObj( supFile ),
      srcUrl: supFile.signedUrl
    } ) );

    const gqlObj = {
      projectType: file.type || '',
      published: file.publishedAt || '',
      modified: file.updatedAt || '',
      owner: file.team?.name || '',
      desc: file.descPublic || '',
      images: structuredImages || [],
      supportFiles: structuredSupportFiles || [],
      categories: getTransformedLangTaxArray( file.categories ) || []
    };

    return { ...graphicObj, ...gqlObj };
  }

  return graphicObj;
};
