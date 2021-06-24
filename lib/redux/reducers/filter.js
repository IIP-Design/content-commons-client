import {
  CLEAR_FILTERS,
  FILTER_CHANGE,
  FILTER_CATEGORY_CHANGE,
  FILTER_COUNTRY_CHANGE,
  FILTER_POST_TYPE_CHANGE,
  FILTER_SOURCE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_TO_DATE_CHANGE,
  FILTER_FROM_DATE_CHANGE,
} from '../constants';

const INITIAL_STATE = {
  categories: [],
  countries: [],
  sources: [],
  postTypes: [],
  dateFrom: new Date().toString(),
  dateTo: new Date().toString(),
  date: 'recent',
};

const getValue = value => {
  if ( !value ) {
    return [];
  }

  if ( typeof value === 'string' ) {
    return [value];
  }

  return [...value];
};


const filter = ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case CLEAR_FILTERS:

      return {
        ...state,
        ...INITIAL_STATE,
      };

    case FILTER_CHANGE: {
      if ( !action.payload ) {
        return state;
      }

      const {
        postTypes,
        date,
        categories,
        countries,
        sources,
      } = action.payload;

      return { ...state,
        ...( {
          postTypes: getValue( postTypes ),
          date: date ? date.toString() : 'recent',
          categories: getValue( categories ),
          countries: getValue( countries ),
          sources: getValue( sources ),
        } ) };
    }

    case FILTER_CATEGORY_CHANGE:
      return { ...state, categories: getValue( action.payload ) };

    case FILTER_COUNTRY_CHANGE:
      return { ...state, countries: getValue( action.payload ) };


    case FILTER_POST_TYPE_CHANGE:
      return { ...state, postTypes: getValue( action.payload ) };


    case FILTER_SOURCE_CHANGE:
      return { ...state, sources: getValue( action.payload ) };


    case FILTER_DATE_CHANGE:
      return {
        ...state,
        date: action.payload ? action.payload.toString() : 'recent',
      };

    case FILTER_FROM_DATE_CHANGE:
      return {
        ...state,
        dateFrom: action.payload.toString(),
      };

    case FILTER_TO_DATE_CHANGE:
      return {
        ...state,
        dateTo: action.payload.toString(),
      };

    default:
      return state;
  }
};

export default filter;
