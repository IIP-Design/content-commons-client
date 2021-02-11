import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';
import { v4 } from 'uuid';
import { Grid, Header, Item, Modal } from 'semantic-ui-react';

import SignedUrlImage from 'components/SignedUrlImage/SignedUrlImage';
import { getModalContent } from 'components/modals/utils';
import { getCategories } from '../utils';
import { normalizeItem } from 'lib/elastic/parser';
import { typePrioritiesRequest } from 'lib/elastic/api';

import FeaturedLoading from '../FeaturedLoading';
import FeaturedError from '../FeaturedError';

import './Priorities.scss';

const Priorities = ( { categories, label, term, user, locale } ) => {
  const [items, setItems] = useState( [] );
  const [state, setState] = useState( { loading: false, error: false } );

  useEffect( () => {
    let mounted = true;

    setState( { loading: true, error: false } );

    typePrioritiesRequest( term, categories, locale, user )
      .then( res => {
        // check to ensure we are mounted in the event we unmounted before request returned
        if ( mounted ) {
          const priorities = res?.hits?.hits?.map( item => normalizeItem( item, locale ) );

          if ( priorities ) {
            setState( { loading: false, error: false } );
            setItems( priorities );
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
    categories, label, term, user, locale,
  ] );

  if ( state.error ) {
    return <FeaturedError type="priorities" />;
  }

  if ( state.loading ) {
    return <FeaturedLoading loading={ state.loading } />;
  }

  const renderPrioritiesWithMeta = ps => ps.slice( 1 ).map( priority => (
    <Modal
      key={ v4() }
      closeIcon
      trigger={ (
        <Item className="prioritiesItem">
          <SignedUrlImage className="prioritiesItem_img" url={ priority.thumbnail }>
            <img src={ priority.icon } className="metaicon" alt="icon" />
          </SignedUrlImage>
          <Item.Content>
            <Item.Header>{ priority.title }</Item.Header>
            <div className="meta">
              <span className="date">{ moment( priority.published ).format( 'MMMM DD, YYYY' ) }</span>
              <span className="categories">{ getCategories( priority ) }</span>
            </div>
          </Item.Content>
        </Item>
      ) }
    >
      <Modal.Content>
        { getModalContent( priority ) }
      </Modal.Content>
    </Modal>
  ) );

  if ( items.length < 3 ) return null;

  const categoryIds = categories?.map( cat => cat.key );

  return (
    <section className="priorities">
      <div className="prioritiescontainer">
        <div className="prioritiestitle">
          <Header as="h1" size="large">
            { `Department Priority: ${label}` }
          </Header>
          <Link
            href={ {
              pathname: '/results',
              query: {
                language: 'en-us',
                term,
                categories: categoryIds,
                sortBy: 'relevance',
              },
            } }
          >
            <a className="browseAll">Browse All</a>
          </Link>
        </div>
        <Grid columns="equal" stackable stretched>
          <Grid.Column width={ 8 } className="prioritiesgridleft">
            { items && items[0] && (
              <Modal
                closeIcon
                trigger={ (
                  <SignedUrlImage className="prioritiesleft" url={ items[0].thumbnail }>
                    <div className="prioritiesoverlay">
                      <div className="prioritiesoverlay_title">{ items[0].title }</div>
                      <img src={ items[0].icon } className="prioritiesoverlay_icon" alt="icon" />
                    </div>
                  </SignedUrlImage>
                ) }
              >
                <Modal.Content>{ getModalContent( items[0] ) }</Modal.Content>
              </Modal>
            ) }
          </Grid.Column>
          <Grid.Column width={ 8 } className="prioritiesgridright">
            <Item.Group>{ items && renderPrioritiesWithMeta( items ) }</Item.Group>
          </Grid.Column>
        </Grid>
      </div>
    </section>
  );
};

Priorities.propTypes = {
  term: PropTypes.string,
  label: PropTypes.string,
  categories: PropTypes.array,
  locale: PropTypes.string,
  user: PropTypes.object,
};

export default Priorities;
