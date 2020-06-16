import React from 'react';
import PropTypes from 'prop-types';
import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import GraphicProject from 'components/GraphicProject/GraphicProject';
import { fetchUser } from 'context/authContext';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';

const GraphicPage = ( { item, url } ) => (
  <ContentPage item={ item } url={ url }>
    <GraphicProject item={ item } />
  </ContentPage>
);

GraphicPage.getInitialProps = async ctx => {
  const { req, query, asPath } = ctx;
  const user = await fetchUser( ctx );

  const url = req && req.headers && req.headers.host && asPath
    ? `https://${req.headers.host}${asPath}`
    : '';

  if ( query && query.site && query.id ) {
    const response = await getItemRequest( query.site, query.id, user );
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

GraphicPage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string,
};

export default GraphicPage;
