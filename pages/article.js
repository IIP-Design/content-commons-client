import React from 'react';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Post from 'components/Post/Post';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';

const ArticlePage = ( { item, url } ) => (
  <ContentPage item={ item } url={ url }>
    <Post item={ item } />
  </ContentPage>
);

ArticlePage.getInitialProps = async ctx => {
  const { req, query, asPath } = ctx;

  const url = req && req.headers && req.headers.host && asPath
    ? `https://${req.headers.host}${asPath}`
    : '';

  if ( query && query.site && query.id ) {
    const response = await getItemRequest( query.site, query.id );
    const item = getDataFromHits( response );

    if ( item && item[0] ) {
      return {
        item: normalizeItem( item[0] ),
        url,
      };
    }
  }

  return {};
};

ArticlePage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string,
};

export default ArticlePage;
