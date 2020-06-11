import React from 'react';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Image from 'components/Image/Image';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';

const ImagePage = ( { item, url } ) => (
  <ContentPage item={ item } url={ url }>
    <Image item={ item } />
  </ContentPage>
);

ImagePage.getInitialProps = async ctx => {
  const { req, query, asPath } = ctx;

  const url = req && req.headers && req.headers.host && asPath
    ? `https://${req.headers.host}${asPath}`
    : '';

  if ( query && query.site && query.id ) {
    const response = await getItemRequest( query.site, query.id );
    const item = getDataFromHits( response );

    if ( item && item[0] ) {
      return {
        item: normalizeItem( item[0], query.language ),
        url,
      };
    }
  }
};

ImagePage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string,
};

export default ImagePage;
