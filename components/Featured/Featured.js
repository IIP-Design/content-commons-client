import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { Loader, Message } from 'semantic-ui-react';

import Packages from './Packages/Packages';
import Recents from './Recents/Recents';
import Priorities from './Priorities/Priorities';
import { getFeatured, loadPostTypes } from './utils';

import { FeaturedContext, featuredReducer } from 'context/featuredContext';
import { PostTypeContext, postTypeReducer } from 'context/postTypeContext';
import { typePrioritiesRequest, typeRecentsRequest, typeRequestDesc } from 'lib/elastic/api';

const Featured = ( { data, user } ) => {
  const sorted = sortBy( data, 'order' );
  const featuredComponents = [];

  const [state, dispatch] = useReducer( featuredReducer );
  const [postTypeState, postTypeDispatch] = useReducer( postTypeReducer );

  useEffect( () => {
    if ( data?.length ) {
      dispatch( { type: 'LOAD_FEATURED_PENDING' } );

      const promiseArr = data.map( async d => {
        const { component, props: p } = d;

        switch ( component ) {
          case 'priorities':
            return typePrioritiesRequest( p.term, p.categories, p.locale, user )
              .then( res => ( {
                component,
                ...p,
                data: res,
                key: d.key,
              } ) );

          case 'packages':
            return typeRequestDesc( p.postType, user )
              .then( res => ( {
                component,
                ...p,
                data: res,
                key: d.key,
              } ) );

          case 'recents':
            return typeRecentsRequest( p.postType, p.locale, user )
              .then( res => ( {
                component,
                ...p,
                data: res,
                key: d.key,
              } ) );

          default:
            return {};
        }
      } );

      getFeatured( promiseArr, dispatch );
    }
  }, [data, user] );

  useEffect( () => {
    loadPostTypes( postTypeDispatch, user );
  }, [postTypeDispatch, user] );

  sorted.forEach( d => {
    const { component, props } = d;

    switch ( component ) {
      case 'priorities':
        featuredComponents.push( <Priorities key={ d.key } { ...props } /> );
        break;
      case 'recents':
        featuredComponents.push( <Recents key={ d.key } { ...props } /> );
        break;
      case 'packages':
        featuredComponents.push( <Packages key={ d.key } { ...props } /> );
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
      <div style={ { padding: '5rem 2rem', textAlign: 'center' } }>
        <Loader active={ state?.loading } />
      </div>
    );
  }

  if ( !featuredComponents.length ) return null;

  return (
    <div className="featured">
      <FeaturedContext.Provider value={ { dispatch, state } }>
        <PostTypeContext.Provider value={ { dispatch: postTypeDispatch, state: postTypeState } }>
          { featuredComponents }
        </PostTypeContext.Provider>
      </FeaturedContext.Provider>
    </div>
  );
};

Featured.propTypes = {
  data: PropTypes.array,
  user: PropTypes.object,
};

export default Featured;
