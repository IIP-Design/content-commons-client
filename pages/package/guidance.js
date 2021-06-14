import React from 'react';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Package from '../../components/Package/Package';
import { fetchUser } from 'context/authContext';
import { getElasticPkgDocs } from 'components/Package/utils';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';

const PackagePage = ( { item, url } ) => (
  <ContentPage item={ item } url={ url }>
    <Package item={ item } />
  </ContentPage>
);

PackagePage.getInitialProps = async ctx => {
  const { req, query, asPath } = ctx;
  const user = await fetchUser( ctx );

  const url = req && req.headers && req.headers.host && asPath
    ? `https://${req.headers.host}${asPath}`
    : '';

  const useIdKey = asPath.includes( 'package' );

  if ( query && query.site && query.id ) {
    const response = await getItemRequest( query.site, query.id, useIdKey, user );
    const item = getDataFromHits( response );

    if ( item && item[0] ) {
      const documents = await getElasticPkgDocs( item[0]._source.items, user );
      const _item = normalizeItem( item[0], query.language );

      return {
        item: { ..._item, documents },
        url,
      };
    }
  }

  return {};
};

PackagePage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string,
};

export default PackagePage;
