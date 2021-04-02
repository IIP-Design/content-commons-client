import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';
import { v4 } from 'uuid';
import { Grid, Item, Modal } from 'semantic-ui-react';

import SignedUrlImage from 'components/SignedUrlImage/SignedUrlImage';
import { getModalContent } from 'components/modals/utils';
import { getCategories } from '../utils';
import { normalizeItem } from 'lib/elastic/parser';
import { typePrioritiesRequest, categoryNameIdRequest } from 'lib/elastic/api';

import FeaturedLoading from '../FeaturedLoading';
import FeaturedError from '../FeaturedError';

import './Priorities.scss';

const Priorities = ( { categories, label, term, user, locale, tags } ) => {
  const [items, setItems] = useState( [] );
  const [categoryIds, setCategoryIds] = useState( [] );
  const [state, setState] = useState( { loading: false, error: false } );

  useEffect( () => {
    let mounted = true;

    setState( { loading: true, error: false } );

    // If config has categories, load categories to obtain
    // category id to pass to results page as a search param
    if ( categories?.length ) {
      categoryNameIdRequest().then( res => {
        const cats = res.hits.hits;
        const ids = cats
          .filter( cat => categories.includes( cat._source.language.en ) )
          .map( cat => cat._id );

        setCategoryIds( ids );
      } );
    }
    typePrioritiesRequest( term, categories, tags, locale, user )
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
    categories, tags, label, term, user, locale,
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
          {
            priority.type === 'document'
              ? (
                <div className="prioritiesItem_text">
                  <div className="use">{ priority.use }</div>
                  <img src={ priority.icon } className="metaicon" alt="icon" />
                </div>
              )
              : (
                <SignedUrlImage className="prioritiesItem_img" url={ priority.thumbnail }>
                  <img src={ priority.icon } className="metaicon" alt="icon" />
                </SignedUrlImage>
              )
          }
          <Item.Content>
            <h3 className="header">
              <button type="button">
                { priority.title }
              </button>
            </h3>
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

  /**
   * Puts quotes around search phrases to ensure search is
   * executed on a phrase and not tokenized into separate words
   * Assumes if array has single element, it is considered a phrase
   * @param {string} _term Selected post types
   * @return Quoted/unquoted string
   */
  const getTermQry = _term => {
    if ( !_term.length ) return '';

    return _term?.length === 1 ? `"${_term?.join( ' ' )}"` : _term?.join( ' ' );
  };

  if ( items.length < 3 ) return null;

  return (
    <section
      className="priorities"
      aria-label={ `Department Priority: ${label}` }
    >
      <div className="prioritiescontainer">
        <div className="prioritiestitle">
          <h2 className="ui large header">
            { `Department Priority: ${label}` }
          </h2>
          <Link
            href={ {
              pathname: '/results',
              query: {
                language: 'en-us',
                term: getTermQry( term ),
                categories: categoryIds,
                sortBy: 'relevance',
              },
            } }
          >
            <a className="browseAll" aria-label={ `Browse all ${label} content` }>Browse All</a>
          </Link>
        </div>
        <Grid columns="equal" stackable stretched>
          <Grid.Column width={ 8 } className="prioritiesgridleft">
            { items && items[0] && (
              <Modal
                closeIcon
                trigger={
                  items[0].type === 'document'
                    ? (
                      <div className="prioritiesleft text">
                        <div className="prioritiesoverlay">
                          <div className="prioritiesoverlay_use">{ items[0].use }</div>
                          <h3 className="prioritiesoverlay_title">
                            <button type="button">
                              { items[0].title }
                            </button>
                          </h3>
                          <img src={ items[0].icon } className="prioritiesoverlay_icon" alt="icon" />
                        </div>
                      </div>
                    )
                    : (
                      <SignedUrlImage className="prioritiesleft" url={ items[0].thumbnail }>
                        <div className="prioritiesoverlay">
                          <h3 className="prioritiesoverlay_title">
                            <button type="button">
                              { items[0].title }
                            </button>
                          </h3>
                          <img src={ items[0].icon } className="prioritiesoverlay_icon" alt="icon" />
                        </div>
                      </SignedUrlImage>
                    // eslint-disable-next-line react/jsx-indent
                    )
                }
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
  term: PropTypes.array,
  label: PropTypes.string,
  categories: PropTypes.array,
  tags: PropTypes.array,
  locale: PropTypes.string,
  user: PropTypes.object,
};

export default Priorities;
