import React from 'react';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Document from 'components/Document/Document';
import { fetchUser } from 'context/authContext';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';

const DocumentPage = ( { item, url } ) => (
  <ContentPage item={ item } url={ url }>
    <Document item={ item } />
  </ContentPage>
);

DocumentPage.getInitialProps = async ctx => {
  const { req, query, asPath } = ctx;

  const user = await fetchUser( ctx );

  const url = req && req.headers && req.headers.host && asPath
    ? `https://${req.headers.host}${asPath}`
    : '';

  const useIdKey = asPath.includes( 'document' );

  if ( query && query.site && query.id ) {
    const response = await getItemRequest( query.site, query.id, useIdKey, user );
    const item = getDataFromHits( response );

    if ( item && item[0] ) {
      return {
        item: normalizeItem( item[0], query.language ),
        url,
      };
    }
  }

  return {};
};

DocumentPage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string,
};

export default DocumentPage;
