import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getItemRequest, getDataFromHits } from 'lib/elastic/api';
import Video from 'components/Video/Video';
import { normalizeItem } from 'lib/elastic/parser';
import { populateMetaArray } from 'lib/socialHeaders.js';
import Head from 'next/head';

class VideoPage extends Component {
  static async getInitialProps ( { req, query, asPath } ) {
    const url = ( req && req.headers && req.headers.host && asPath )
      ? `https://${req.headers.host}${asPath}`
      : '';
    if ( query && query.site && query.id ) {
      const response = await getItemRequest( query.site, query.id );
      const item = getDataFromHits( response );
      if ( item && item[0] ) {
        return {
          item: normalizeItem( item[0], query.language ),
          url
        };
      }
    }
  }

  render() {
    const { item, url } = this.props;
    const styles = {
      page: {
        marginTop: '90px'
      },
      paragraph: {
        fontSize: ' 2em',
        fontWeight: 700
      }
    };
    const metaTags = populateMetaArray( item, url );

    if ( !item ) {
      return (
        <section className="max_width_1200" style={ styles.page }>
          <p style={ styles.paragraph }>Content Unavailable</p>
        </section>
      );
    }

    return (
      <Fragment>
        <Head>
          { metaTags && metaTags.map( tag => (
            <meta key={ tag.property } property={ tag.property } content={ tag.content } />
          ) ) }
        </Head>
        <section className="max_width_1200" style={ styles.page }>
          <Video item={ item } />
        </section>
      </Fragment>
    );
  }
}

VideoPage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string
};

export default VideoPage;
