import React from 'react';

const initialState = {
  error: false,
  list: [],
  loading: false,
};

export const PostTypeContext = React.createContext( initialState );

export const postTypeReducer = ( state, action ) => {
  const { payload } = action;

  switch ( action.type ) {
    case 'LOAD_POST_TYPES_PENDING':
      return {
        ...state,
        loading: true,
      };

    case 'LOAD_POST_TYPES_FAILED':
      return {
        ...state,
        error: true,
      };

    case 'LOAD_POST_TYPES_SUCCESS':
      return {
        ...state,
        error: false,
        loading: false,
        list: payload,
      };

    default:
      return state;
  }
};
