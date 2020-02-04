/*
 * Normalize Document type data structure from both APIs
 *
 */

import { getTransformedLangTaxArray } from 'lib/utils';
import DosSeal from 'static/images/dos_seal.svg';

export const normalizeDocumentItemByAPI = ( { file, useGraphQl = false } ) => {
  const documentObj = {
    type: 'document',
    id: file.id || '',
    published: file.published || '',
    modified: file.modified || '',
    author: file.author || '',
    owner: file.owner || '',
    site: file.site || '',
    title: file.title,
    content: file.content,
    logo: DosSeal || '',
    language: file.language,
    documentUrl: file.url || '',
    documentUse: file.use || '',
    tags: file.tags || [],
  };

  if ( useGraphQl ) {
    const graphFields = {
      created: file.createdAt || '',
      published: file.publishedAt || '',
      modified: file.updatedAt || '',
      author: ( file.author ? `${file.author.firstname} ${file.author.lastname}` : '' ),
      owner: ( file.team?.name ) || '',
      documentUrl: file.url || '',
      documentUse: ( file?.use?.name ) || '',
      tags: getTransformedLangTaxArray( file.tags ) || [],
    };

    return { ...documentObj, ...graphFields };
  }

  return documentObj;
};
