import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';
import { populateMetaArray } from 'lib/socialHeaders.js';
import Package from 'components/Package/Package';
import { packageItem } from 'components/Package/packageElasticMock';

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

PackagePage.getInitialProps = async ( { req, query, asPath } ) => {
  const url = ( req && req.headers && req.headers.host && asPath )
    ? `https://${req.headers.host}${asPath}`
    : '';

  if ( query && query.site && query.id ) {
    // const response = await getItemRequest( query.site, query.id );
    // const item = getDataFromHits( response );
    const item = packageItem;

    if ( item && item[0] ) {
      return {
        item: normalizeItem( item[0], query.language ),
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
