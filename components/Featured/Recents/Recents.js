import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';
import { v4 } from 'uuid';
import { Modal } from 'semantic-ui-react';

import { getModalContent } from 'components/modals/utils';
import { getCategories } from '../utils';
import { normalizeItem } from 'lib/elastic/parser';
import { typeRecentsRequest } from 'lib/elastic/api';

import SignedUrlImage from 'components/SignedUrlImage/SignedUrlImage';
import FeaturedLoading from '../FeaturedLoading';
import FeaturedError from '../FeaturedError';

import styles from './Recents.module.scss';

const Recents = ( { postType, locale, user } ) => {
  const [items, setItems] = useState( [] );
  const [state, setState] = useState( { loading: false, error: false } );

  // This is repeated in priorities and packages, consider extracting to custom hook
  useEffect( () => {
    let mounted = true;

    setState( { loading: true, error: false } );

    typeRecentsRequest( postType, locale, user )
      .then( res => {
      // check to ensure we are mounted in the event we unmounted before request returned
        if ( mounted ) {
          const recents = res?.hits?.hits?.map( item => normalizeItem( item, locale ) );

          if ( recents ) {
            setState( { loading: false, error: false } );
            setItems( recents );
          }
        }
      } )
      .catch( err => {
        setState( { loading: false, error: true } );
      } );

    return () => {
      mounted = false;
    };
  }, [
    postType, locale, user,
  ] );

  const getSectionLabel = type => {
    switch ( type ) {
      case 'post':
        return 'Articles';

      case 'video':
        return 'Videos';

      case 'graphic':
        return 'Graphics';

      case 'document':
        return 'Press Releases and Guidance';

      default:
        return '';
    }
  };

  const postTypeLabel = getSectionLabel( postType );

  if ( state.error ) {
    return <FeaturedError type={ `${postTypeLabel?.toLowerCase()}` } />;
  }

  if ( state.loading ) {
    return <FeaturedLoading loading={ state.loading } />;
  }

  if ( items.length < 3 ) return null;

  return (
    <section
      className={ styles.recents }
      aria-label={ `Latest ${postTypeLabel}` }
    >
      <div className={ styles.container }>
        <div className={ styles.title }>
          <h2 className={ styles.section_heading }>
            { postTypeLabel && `Latest ${postTypeLabel}` }
          </h2>
          <Link
            href={ {
              pathname: '/results',
              query: {
                language: 'en-us',
                sortBy: 'published',
                postTypes: [postType],
              },
            } }
          >
            <a className={ styles.browseAll } aria-label={ `Browse all ${postTypeLabel}` }>Browse All</a>
          </Link>
        </div>

        <div className={ styles.items }>
          { items && items[0] && (
            <Modal
              closeIcon
              trigger={ (
                <SignedUrlImage className={ styles.primary } url={ items[0].thumbnail }>
                  <div className={ styles.overlay }>
                    <h3 className={ styles.overlay_heading }>
                      <button type="button">
                        { items[0].title }
                      </button>
                    </h3>
                    <img
                      src={ items[0].icon }
                      className={ styles.overlay_icon }
                      alt={ `${postType} icon` }
                    />
                  </div>
                </SignedUrlImage>
              ) }
            >
              <Modal.Content>{ getModalContent( items[0] ) }</Modal.Content>
            </Modal>
          ) }

          { items
            && items.slice( 1 ).map( recent => (
              <Modal
                key={ v4() }
                closeIcon
                trigger={ (
                  <div className={ styles.item }>
                    <SignedUrlImage className={ styles.item_img } url={ recent.thumbnail }>
                      <img src={ recent.icon } className={ styles.metaicon } alt={ `${postType} icon` } />
                    </SignedUrlImage>
                    <div className={ styles.content }>
                      <h3 className={ styles.content_heading }>
                        <button type="button">
                          { recent.title }
                        </button>
                      </h3>
                      <div className={ styles.meta }>
                        <span className={ styles.date }>
                          { moment( recent.published ).format( 'MMMM DD, YYYY' ) }
                        </span>
                        <span className={ styles.categories }>{ getCategories( recent ) }</span>
                      </div>
                    </div>
                  </div>
                ) }
              >
                <Modal.Content>{ getModalContent( recent ) }</Modal.Content>
              </Modal>
            ) ) }
        </div>
      </div>
    </section>
  );
};

Recents.propTypes = {
  postType: PropTypes.string,
  locale: PropTypes.string,
  user: PropTypes.object,
};

export default Recents;
