import React from 'react';

const initialState = {
  categories: [],
  countries: [],
  sources: [],
  postTypes: [],
  dateFrom: new Date(),
  dateTo: new Date(),
  date: 'recent',
};

export const FilterContext = React.createContext( initialState );

const handlePayloadType = ( payload, state, prop ) => {
  // If there is no payload, clear selected property
  if ( !payload ) {
    return { ...state, [prop]: [] };
  }

  if ( typeof payload === 'string' ) {
    return { ...state, [prop]: [payload] };
  }

  return { ...state, [prop]: [...payload] };
};

export const filterReducer = ( state, action ) => {
  const { payload } = action;

  switch ( action.type ) {
    case 'CLEAR_FILTERS':
      return initialState;

    case 'FILTER_CATEGORY_CHANGE':
      return handlePayloadType( payload, state, 'categories' );

    case 'FILTER_COUNTRY_CHANGE':
      return handlePayloadType( payload, state, 'countries' );

    case 'FILTER_POST_TYPE_CHANGE':
      return handlePayloadType( payload, state, 'postTypes' );

    case 'FILTER_SOURCE_CHANGE':
      return handlePayloadType( payload, state, 'sources' );

    case 'FILTER_DATE_CHANGE':
      return {
        ...state,
        date: payload || 'recent',
      };

    case 'FILTER_FROM_DATE_CHANGE':
      return {
        ...state,
        dateFrom: payload,
      };

    case 'FILTER_TO_DATE_CHANGE':
      return {
        ...state,
        dateTo: payload,
      };

    default:
      return state;
  }
};
