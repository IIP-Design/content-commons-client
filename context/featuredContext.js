import React from 'react';

const initialState = {
  id: 0,
  priorities: {},
  recents: {},
  components: null,
  loading: false,
  lastLoad: 0,
  error: false,
};

export const FeaturedContext = React.createContext( initialState );

export const featuredReducer = ( state, action ) => {
  const { payload } = action;

  console.dir( payload );

  switch ( action.type ) {
    case 'LOAD_FEATURED_FAILED':
      return {
        ...state,
        id: 0,
        loading: false,
        error: true,
      };
    case 'LOAD_FEATURED_PENDING':
      return {
        ...state,
        id: payload.id,
        loading: true,
        error: false,
      };
    case 'LOAD_FEATURED_SUCCESS':
      return {
        ...state,
        id: payload.id,
        priorities: payload.priorities,
        recents: payload.recents,
        components: payload.components,
        loading: false,
        error: false,
        lastLoad: Date.now(),
      };
    default:
      return state;
  }
};
