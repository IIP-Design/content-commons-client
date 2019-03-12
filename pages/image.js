import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getItemRequest } from 'lib/elastic/api';
import Image from 'components/Image/Image';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';
import { populateMetaArray } from 'lib/socialHeaders.js';
import Head from 'next/head';

class ImagePage extends Component {
  static async getInitialProps ( { req, query, asPath } ) {
    const url = ( req && req.headers && req.headers.host && asPath )
      ? `https://${req.headers.host}${asPath}`
      : '';

    if ( query && query.site && query.id ) {
      const response = await getItemRequest( query.site, query.id );
      const item = getDataFromHits( response );
      // Create temp item
      // const item = {
      //   _id: 'abc123',
      //   _index: 'images_20180501',
      //   _score: 1.01,
      //   _type: 'image',
      //   _source: {
      //     post_id: 6613,
      //     site: 'commons.america.gov',
      //     type: 'image',
      //     subtype: 'poster',
      //     published: '2017-12-18T10:53:49+00:00',
      //     modified: '2018-01-03T13:38:57+00:00',
      //     owner: 'IIP Editorial Content',
      //     author: 'John Doe',
      //     protected: true,
      //     unit: [
      //       {
      //         language: {
      //           language_code: 'en',
      //           locale: 'en-US',
      //           text_direction: false,
      //           display_name: 'English',
      //           native_name: 'English',
      //           different_language: true
      //         },
      //         title: 'Preserve the Earth 2018: Protect Marine Species from Ocean Debris — Poster',
      //         desc: 'The 2018 Preserve the Earth poster to mark Earth Day on Sunday, April 22, 2018, is here! This beautiful poster, illustrated by artist Cathie Bleck, depicts marine wildlife put at risk by plastic debris in our oceans: dolphins, whales, birds, seals, crabs and tiny plankton among them.',
      //         internal_desc: 'Use this poster for awareness around environmental impact. Print the poster and hang it in your space, or share the web version digitally. This could include events, campaigns ... Do not use this poster for ....',
      //         categories: [
      //           {
      //             id: 'bLWWJ2MBCLPpGnLD2j9T',
      //             name: 'foreign aid'
      //           }
      //         ],
      //         tags: [
      //           'environment',
      //           'global issues'
      //         ],
      //         images: [
      //           {
      //             src: 'https://staticcdp.s3.amazonaws.com/2019/01/ylai.state.gov_4318/7d67e38872c0c1b67393b1e3589abc0b.jpg', // string
      //             md5: '1a79a4d60de6718e8e5b326e338ae533',
      //             filetype: 'jpg',
      //             size: {
      //               width: 640,
      //               height: 360,
      //               filesize: 197467
      //             },
      //             quality: 'web',
      //             use: 'infographic',
      //             editable: true
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // };
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
        fontSize: '2em',
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
          <Image item={ item } />
        </section>
      </Fragment>
    );
  }
}

ImagePage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string
};

export default ImagePage;
