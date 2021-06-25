import { getTransformedLangTaxArray } from 'lib/utils';
import { packageDocumentsRequest } from 'lib/elastic/api';
import { getDataFromHits } from 'lib/elastic/parser';
import DosSeal from 'static/images/dos_seal.svg';

/*
 * Normalize Document type data structure from both APIs
 *
 */
export const normalizeDocumentItemByAPI = ( { file, useGraphQl = false } ) => {
  const documentObj = {
    type: 'document',
    id: file.id || '',
    published: file.published || '',
    modified: file.modified || '',
    author: file.author || '',
    owner: file.owner || '',
    site: file.site || '',
    title: file.title || '',
    excerpt: file.excerpt || '',
    content: file.content || '',
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
      author: file.author ? `${file.author.firstname} ${file.author.lastname}` : '',
      owner: file.team?.name || '',
      documentUrl: file.url || '',
      documentUse: file?.use?.name || '',
      excerpt: file?.excerpt || '',
      tags: getTransformedLangTaxArray( file.tags ) || [],
    };

    return { ...documentObj, ...graphFields };
  }

  return documentObj;
};

/*
 * Request documents for a package from Elasticsearch
 * @param docs array of objects w shape { id, item }
 */
export const getElasticPkgDocs = async ( documents, user ) => {
  if ( user && user.id !== 'public' ) {
    try {
      const docIds = documents.map( doc => doc.id );
      const responseHits = await packageDocumentsRequest( docIds, user );
      const docs = getDataFromHits( responseHits )?.map( hit => hit._source );

      return docs;
    } catch ( error ) {
      console.log( error );

      return error;
    }
  }
};
