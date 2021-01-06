import React, { useRef, useEffect, useReducer } from 'react';
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

const Featured = ( { user } ) => {
  // useRef to maintain value between renders
  const sorted = useRef( [] );
  const featuredComponents = [];

  const [state, dispatch] = useReducer( featuredReducer );
  const [postTypeState, postTypeDispatch] = useReducer( postTypeReducer );

  console.dir( state );

  useEffect( () => {
    dispatch( { type: 'LOAD_FEATURED_PENDING' } );
    const data = user && user.id !== 'user' ? [...publicData, ...privateData] : [...publicData];

    sorted.current = sortBy( data, 'order' );

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
  }, [user] );

  useEffect( () => {
    loadPostTypes( postTypeDispatch, user );
  }, [postTypeDispatch, user] );

  sorted.current.forEach( d => {
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
