import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';
import { populateMetaArray } from 'lib/socialHeaders.js';
import Package from 'components/Package/Package';
import { fetchUser } from 'context/authContext';
import { getElasticPkgDocs } from 'components/Package/utils';

const styles = {
  page: {
    marginTop: '90px'
  },
  paragraph: {
    fontSize: '2em',
    fontWeight: 700
  }
};

const PackagePage = props => {
  const { item, url } = props;
  if ( !item ) {
    return (
      <section className="max_width_1200" style={ styles.page }>
        <p style={ styles.paragraph }>Content Unavailable</p>
      </section>
    );
  }

  const metaTags = populateMetaArray( item, url );

  return (
    <Fragment>
      <Head>
        { metaTags && metaTags.map( tag => (
          <meta key={ tag.property } property={ tag.property } content={ tag.content } />
        ) ) }
      </Head>
      <section className="max_width_1200" style={ styles.page }>
        <Package item={ item } />
      </section>
    </Fragment>
  );
};

PackagePage.getInitialProps = async ctx => {
  const { req, query, asPath } = ctx;
  const user = await fetchUser( ctx );

  const url = ( req && req.headers && req.headers.host && asPath )
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
        url
      };
    }
  }
  return {};
};

PackagePage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string
};

export default PackagePage;
