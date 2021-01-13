import React, { useState, useEffect, useReducer } from 'react';
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

import { useAuth } from 'context/authContext';

const privateData = [
  {
    key: 'packages_1',
    component: 'packages',
    order: 1,
    props: {
      postType: 'package',
      locale: 'en-us',
    },
  },
];

const publicData = [
  {
    key: 'priorities_1',
    component: 'priorities',
    order: 2,
    props: {
      term: 'china',
      label: 'China',
      categories: [],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_2',
    component: 'priorities',
    order: 3,
    props: {
      term: 'coronavirus covid',
      label: 'Coronavirus (COVID-19)',
      categories: [],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_3',
    component: 'priorities',
    order: 4,
    props: {
      term: 'iran',
      label: 'Iran',
      categories: [
        { key: 'dLWWJ2MBCLPpGnLD3D-N', display_name: 'Economic Opportunity' },
        { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' },
        { key: 'JFqWJ2MBNxuyMP4E5Cgn', display_name: 'Global Issues' },
      ],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_4',
    component: 'priorities',
    order: 5,
    props: {
      term: '5G',
      label: '5G',
      categories: [],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_5',
    component: 'priorities',
    order: 6,
    props: {
      term: 'venezuela',
      label: 'Venezuela',
      categories: [
        { key: 'JFqWJ2MBNxuyMP4E5Cgn', display_name: 'Global Issues' },
        { key: 'MVqWJ2MBNxuyMP4E6Ci0', display_name: 'Good Governance' },
        { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' },
      ],
      locale: 'en-us',
    },
  },
  {
    key: 'recents_1',
    component: 'recents',
    order: 7,
    props: {
      postType: 'video',
      locale: 'en-us',
    },
  },
  {
    key: 'recents_2',
    component: 'recents',
    order: 8,
    props: {
      postType: 'post',
      locale: 'en-us',
    },
  },
  {
    key: 'recents_3',
    component: 'recents',
    order: 9,
    props: {
      postType: 'graphic',
      locale: 'en-us',
    },
  },
];

const Featured = () => {
  const { user } = useAuth();
  const [featuredComponents, setFeaturedComponents] = useState( [] );
  const [state, dispatch] = useReducer( featuredReducer );
  const [postTypeState, postTypeDispatch] = useReducer( postTypeReducer );

  useEffect( () => {
    let isMounted = true;

    dispatch( { type: 'LOAD_FEATURED_PENDING' } );
    console.log( 'LOAD_FEATURED_PENDING' );
    console.log( 'USER' );
    console.dir( user );

    const getDataBasedOnUser = _user => {
      const data
         = _user && _user.id !== 'user' ? [...publicData, ...privateData] : [...publicData];

      return sortBy( data, 'order' );
    };

    /**
     * Fetches and return documents for each content type based
     * on the data array
     * @param {object} data list of content to display
     */
    const getDocumentsForEachSection = async data => {
      const response = await Promise.all(
        data.map( async d => {
          const { component, props: p } = d;

          switch ( component ) {
            case 'priorities': {
              const res = await typePrioritiesRequest( p.term, p.categories, p.locale, user );

              return {
                component,
                ...p,
                data: res,
                key: d.key,
              };
            }

            case 'packages': {
              const res = await typeRequestDesc( p.postType, user );

              return {
                component,
                ...p,
                data: res,
                key: d.key,
              };
            }

            case 'recents': {
              const res = await typeRecentsRequest( p.postType, p.locale, user );

              return {
                component,
                ...p,
                data: res,
                key: d.key,
              };
            }

            default:
              return {};
          }
        } ),
      );

      return response;
    };

    /**
     * Returns components based on the data array
     * @param {object} data list of content to display
     */
    const getComponents = data => data.reduce( ( acc, val ) => {
      const { component, props } = val;

      switch ( component ) {
        case 'priorities':
          return [...acc, <Priorities key={ val.key } { ...props } />];

        case 'recents':
          return [...acc, <Recents key={ val.key } { ...props } />];

        case 'packages':
          return [...acc, <Packages key={ val.key } { ...props } />];

        default:
          return acc;
      }
    }, [] );

    /**
     * Wrapper function that executes fetching user, components and data
     * @param {object} _user authenticated user
     */
    const loadFeaturedItems = async _user => {
      const data = getDataBasedOnUser( _user );
      const components = getComponents( data );
      const { priorities, recents } = getFeatured( await getDocumentsForEachSection( data ) );


      console.log( 'SET FEATURED COMPONENTS' );
      console.dir( data );
      console.dir( components );
      setFeaturedComponents( components );

      console.log( 'LOAD_FEATURED_SUCCESS' );
      dispatch( {
        type: 'LOAD_FEATURED_SUCCESS',
        payload: {
          priorities,
          recents,
        },
      } );
    };

    console.log( `isSubscribed ${isMounted}` );
    if ( isMounted ) {
      loadFeaturedItems( user );
    }

    return () => {
      isMounted = false;
    };
  }, [user] );

  useEffect( () => {
    loadPostTypes( postTypeDispatch, user );
  }, [postTypeDispatch, user] );


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
  user: PropTypes.object,
};

export default Featured;
