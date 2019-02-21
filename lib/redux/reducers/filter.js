import {
  CLEAR_FILTERS,
  FILTER_CATEGORY_CHANGE,
  FILTER_POST_TYPE_CHANGE,
  FILTER_SOURCE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_TO_DATE_CHANGE,
  FILTER_FROM_DATE_CHANGE,
  SEARCH_LANGUAGE_UPDATE
} from '../constants';

export const dateList = [
  { key: 'recent', display_name: 'Any Time' },
  {
    key: 'now-1d',
    display_name: 'Past 24 Hours'
  },
  {
    key: 'now-1w',
    display_name: 'Past Week'
  },
  {
    key: 'now-1M',
    display_name: 'Past Month'
  },
  {
    key: 'now-1y',
    display_name: 'Past Year'
  }
];

const INITIAL_STATE = {
  categories: [],
  postTypes: [],
  sources: [],
  // language: { key: 'en-us', display_name: 'English' },
  language: 'en-us',
  dateFrom: new Date(),
  dateTo: new Date(),
  dateList,
  date: 'recent'
  // date: { key: 'recent', display_name: 'Any Time' }
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case CLEAR_FILTERS:

      return {
        ...state,
        ...INITIAL_STATE
      };

    case SEARCH_LANGUAGE_UPDATE:
      return {
        ...state,
        language: action.payload
      };

    case FILTER_CATEGORY_CHANGE:
      // if there is no payload, clear selected categories
      if ( !action.payload ) {
        return { ...state, categories: [] };
      }

      if ( typeof action.payload === 'string' ) {
        return { ...state, categories: [action.payload] };
      }
      return { ...state, categories: [...action.payload] };


    case FILTER_POST_TYPE_CHANGE:
      // if there is no payload, clear selected currentPostTypes
      if ( !action.payload ) {
        return { ...state, postTypes: [] };
      }

      if ( typeof action.payload === 'string' ) {
        return { ...state, postTypes: [action.payload] };
      }
      return { ...state, postTypes: [...action.payload] };

    case FILTER_SOURCE_CHANGE:
      // if there is no payload, clear selected currentPostTypes
      if ( !action.payload ) {
        return { ...state, sources: [] };
      }

      if ( typeof action.payload === 'string' ) {
        return { ...state, sources: [action.payload] };
      }
      return { ...state, sources: [...action.payload] };

    case FILTER_DATE_CHANGE:
      return {
        ...state,
        date: action.payload ? action.payload : 'recent'
      };

    case FILTER_FROM_DATE_CHANGE:
      return {
        ...state,
        dateFrom: action.payload
      };

    case FILTER_TO_DATE_CHANGE:
      return {
        ...state,
        dateTo: action.payload
      };

    default:
      return state;
  }
};
