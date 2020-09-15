import React from 'react';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Video from 'components/Video/Video';
import { fetchUser } from 'context/authContext';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';

const VideoPage = ( { item, url } ) => (
  <ContentPage item={ item } url={ url }>
    <Video item={ item } />
  </ContentPage>
);

VideoPage.getInitialProps = async ctx => {
  const { req, query, asPath } = ctx;
  const user = await fetchUser( ctx );

  const url = req && req.headers && req.headers.host && asPath
    ? `https://${req.headers.host}${asPath}`
    : '';

  if ( query && query.site && query.id ) {
    const response = await getItemRequest( query.site, query.id, false, user ) || {};
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

VideoPage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string,
};

export default VideoPage;
