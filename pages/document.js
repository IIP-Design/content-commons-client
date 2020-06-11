import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Document from 'components/Document/Document';
import PageMeta from 'components/Meta/PageMeta';
import { fetchUser } from 'context/authContext';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';

const styles = {
  page: {
    marginTop: '90px',
  },
  paragraph: {
    fontSize: '2em',
    fontWeight: 700,
  },
};

const DocumentPage = ( { item, url } ) => {
  if ( !item ) {
    return (
      <section className="max_width_1200" style={ styles.page }>
        <p style={ styles.paragraph }>Content Unavailable</p>
      </section>
    );
  }

  return (
    <Fragment>
      <PageMeta item={ item } url={ url } />
      <section className="max_width_1200" style={ styles.page }>
        <Document item={ item } />
      </section>
    </Fragment>
  );
};

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
