import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { v4 } from 'uuid';
import { Loader, Message } from 'semantic-ui-react';

import Packages from './Packages/Packages';
import Recents from './Recents/Recents';
import Priorities from './Priorities/Priorities';

import { FeaturedContext, featuredReducer } from 'context/featuredContext';
import { isDataStale } from 'lib/utils';
import { normalizeItem } from 'lib/elastic/parser';
import { typePrioritiesRequest, typeRecentsRequest, typeRequestDesc } from 'lib/elastic/api';

const Featured = ( { data, user } ) => {
  const sorted = sortBy( data, 'order' );
  const featuredComponents = [];

  const [state, dispatch] = useReducer( featuredReducer );

  const isStale = state?.featured?.lastLoad ? isDataStale( state.featured.lastLoad ) : true;

  useEffect( () => {
    const getFeatured = async array => {
      await Promise.all( array )
        .then( resArr => {
          const priorities = {};
          const recents = {};
          let items;

          resArr.forEach( res => {
            if ( res?.data?.hits?.hits ) {
              items = res.data.hits.hits.map( item => normalizeItem( item, res.locale ) );
              switch ( res.component ) {
                case 'priorities':
                  priorities[res.term] = items;
                  break;
                case 'packages':
                case 'recents':
                  recents[res.postType] = items;
                  break;
                default:
                  break;
              }
            }
          } );

          dispatch( {
            type: 'LOAD_FEATURED_SUCCESS',
            payload: {
              priorities,
              recents,
            },
          } );
        } )
        .catch( err => {
          dispatch( {
            type: 'LOAD_FEATURED_FAILED',
          } );
        } );
    };

    if ( data && isStale ) {
      dispatch( { type: 'LOAD_FEATURED_PENDING' } );

      const promiseArr = data.map( async d => {
        const { component, props: p } = d;

        switch ( component ) {
          case 'priorities':
            return typePrioritiesRequest( p.term, p.categories, p.locale, user ).then(
              res => ( {
                component,
                ...p,
                data: res,
                key: v4(),
              } ),
            );
          case 'packages':
            return typeRequestDesc( p.postType, user ).then( res => ( {
              component,
              ...p,
              data: res,
              key: v4(),
            } ) );
          case 'recents':
            return typeRecentsRequest( p.postType, p.locale, user ).then( res => ( {
              component,
              ...p,
              data: res,
              key: v4(),
            } ) );
          default:
            return {};
        }
      } );

      getFeatured( promiseArr );
    }
  }, [
    data, isStale, user,
  ] );

  sorted.forEach( d => {
    const { component, props } = d;

    switch ( component ) {
      case 'priorities':
        featuredComponents.push( <Priorities key={ v4() } { ...props } /> );
        break;
      case 'recents':
        featuredComponents.push( <Recents key={ v4() } { ...props } /> );
        break;
      case 'packages':
        featuredComponents.push( <Packages key={ v4() } { ...props } /> );
        break;
      default:
        break;
    }
  } );

  if ( state?.error ) {
    return (
      <div style={ { padding: '5rem 2rem', textAlign: 'center' } }>
        <Message>
          Oops, something went wrong. We are unable to load the most recent content.
        </Message>
      </div>
    );
  }

  if ( state?.loading ) {
    return (
      <Loader active={ state?.loading } />
    );
  }

  if ( !featuredComponents.length ) return null;

  return (
    <div className="featured">
      <FeaturedContext.Provider value={ { dispatch, state } }>
        { featuredComponents }
      </FeaturedContext.Provider>
    </div>
  );
};

Featured.propTypes = {
  data: PropTypes.array,
  user: PropTypes.object,
};

export default Featured;
