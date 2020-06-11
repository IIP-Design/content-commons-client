import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import PageMeta from 'components/Meta/PageMeta';
import Video from 'components/Video/Video';
import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';

class VideoPage extends Component {
  static async getInitialProps( { req, query, asPath } ) {
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

    return {};
  }

  render() {
    const { item, url } = this.props;
    const styles = {
      page: {
        marginTop: '90px',
      },
      paragraph: {
        fontSize: '2em',
        fontWeight: 700,
      },
    };

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
          <Video item={ item } />
        </section>
      </Fragment>
    );
  }
}

VideoPage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string,
};

export default VideoPage;
