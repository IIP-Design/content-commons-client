import React from 'react';
import PropTypes from 'prop-types';
import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import GraphicProject from 'components/GraphicProject/GraphicProject';
import { fetchUser } from 'context/authContext';
import { getItemRequest } from 'lib/elastic/api';
import { redirectTo } from 'lib/browser';
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
    // Do not need to check for the user here as the server will strip internal content
    // if a token is not present on the user param. Letting the server handle it will mitigate
    // use case that occurs when the user is null.
    const response = await getItemRequest(
      query.site,
      query.id,
      true,
      user,
    );

    if ( !response || response?.internal ) {
      redirectTo( `/login?return=${ctx.asPath}`, ctx );

      return {};
    }

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
