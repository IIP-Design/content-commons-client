import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getItemRequest, getDataFromHits } from 'lib/elastic/api';
import Video from 'components/Video/Video';
import { normalizeItem } from 'lib/elastic/parser';

class VideoPage extends Component {
  static async getInitialProps ( { query } ) {
    if ( query && query.site && query.id ) {
      const response = await getItemRequest( query.site, query.id );
      const item = getDataFromHits( response );
      if ( item && item[0] ) {
        return { item: normalizeItem( item[0], query.language ) };
      }
    }
  }

  render() {
    const { item } = this.props;
    const styles = {
      page: {
        marginTop: '90px'
      },
      paragraph: {
        fontSize: ' 2em',
        fontWeight: 700
      }
    };

    if ( !item ) {
      return (
        <section className="max_width_1200" style={ styles.page }>
          <p style={ styles.paragraph }>Content Unavailable</p>
        </section>
      );
    }

    return (
      <section className="max_width_1200" style={ styles.page }>
        <Video item={ item } />
      </section>
    );
  }
}

VideoPage.propTypes = {
  item: PropTypes.object
};

export default VideoPage;
