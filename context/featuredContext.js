import React from 'react';

const initialState = {
  priorities: {},
  recents: {},
  loading: false,
  lastLoad: 0,
  error: false,
};

export const FeaturedContext = React.createContext( initialState );

export const featuredReducer = ( state, action ) => {
  const { payload } = action;

  switch ( action.type ) {
    case 'LOAD_FEATURED_FAILED':
      return {
        ...state,
        loading: false,
        error: true,
      };
    case 'LOAD_FEATURED_PENDING':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case 'LOAD_FEATURED_SUCCESS':
      return {
        ...state,
        priorities: payload.priorities,
        recents: payload.recents,
        loading: false,
        error: false,
        lastLoad: Date.now(),
      };
    default:
      return state;
  }
};
