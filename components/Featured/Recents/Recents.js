import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';
import { v4 } from 'uuid';
import { Grid, Item, Modal } from 'semantic-ui-react';

import { getModalContent } from 'components/modals/utils';
import { getCategories } from '../utils';
import { normalizeItem } from 'lib/elastic/parser';
import { typeRecentsRequest } from 'lib/elastic/api';

import SignedUrlImage from 'components/SignedUrlImage/SignedUrlImage';
import FeaturedLoading from '../FeaturedLoading';
import FeaturedError from '../FeaturedError';

import './Recents.scss';

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

  const accessibleLabel = `latest-${postType}s-title`;

  return (
    <section
      className="ui container recents"
      aria-labelledby={ accessibleLabel }
    >
      <div className="recentswrapper">
        <div className="recentstitle">
          <h2 id={ accessibleLabel } className="ui large header">
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
            <a className="browseAll">Browse All</a>
          </Link>
        </div>
        <Grid columns="equal" stackable stretched>
          <Grid.Column width={ 8 } className="recentsgridleft">
            { items && items[0] && (
              <Modal
                closeIcon
                trigger={ (
                  <SignedUrlImage className="recentsleft" url={ items[0].thumbnail }>
                    <div className="recentsoverlay">
                      <div className="recentsoverlay_title">{ items[0].title }</div>
                      <img
                        src={ items[0].icon }
                        className="recentsoverlay_icon"
                        alt={ `${postType} icon` }
                      />
                    </div>
                  </SignedUrlImage>
                ) }
              >
                <Modal.Content>{ getModalContent( items[0] ) }</Modal.Content>
              </Modal>
            ) }
          </Grid.Column>
          <Grid.Column width={ 8 } className="recentsgridright">
            <Item.Group>
              { items
                && items.slice( 1 ).map( recent => (
                  <Modal
                    key={ v4() }
                    closeIcon
                    trigger={ (
                      <Item className="recentsItem">
                        <SignedUrlImage className="recentsItem_img" url={ recent.thumbnail }>
                          <img src={ recent.icon } className="metaicon" alt={ `${postType} icon` } />
                        </SignedUrlImage>
                        <Item.Content>
                          <Item.Header>{ recent.title }</Item.Header>
                          <div className="meta">
                            <span className="date">
                              { moment( recent.published ).format( 'MMMM DD, YYYY' ) }
                            </span>
                            <span className="categories">{ getCategories( recent ) }</span>
                          </div>
                        </Item.Content>
                      </Item>
                    ) }
                  >
                    <Modal.Content>{ getModalContent( recent ) }</Modal.Content>
                  </Modal>
                ) ) }
            </Item.Group>
          </Grid.Column>
        </Grid>
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
