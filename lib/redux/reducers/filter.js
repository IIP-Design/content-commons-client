import {
  CLEAR_FILTERS,
  FILTER_CATEGORY_CHANGE,
  FILTER_POST_TYPE_CHANGE,
  FILTER_SOURCE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_TO_DATE_CHANGE,
  FILTER_FROM_DATE_CHANGE
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
  dateFrom: new Date(),
  dateTo: new Date(),
  dateList,
  date: { key: 'recent', display_name: 'Any Time' }
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case CLEAR_FILTERS:
      return {
        ...state,
        query: action.payload
      };

    case FILTER_CATEGORY_CHANGE:
      // if there is no payload, clear selected categories
      if ( !action.payload ) {
        return { ...state, categories: [] };
      }
      return {
        ...state,
        categories: action.payload.checked
          ? [...state.categories, { key: action.payload.key, display_name: action.payload.display_name }]
          : state.categories.filter( category => category.key !== action.payload.key )
      };

    case FILTER_POST_TYPE_CHANGE:

      // if there is no payload, clear selected currentPostTypes
      if ( !action.payload ) {
        return { ...state, postTypes: [] };
      }

      if ( typeof action.payload === 'string' ) {
        return { ...state, postTypes: [action.payload] };
      }

      // if item has been selected, i.e. checked, add it to the currentPostTypes array
      // else filter currentPostTypes array to remove if necessary
      return {
        ...state,
        postTypes: action.payload.checked
          ? [...state.postTypes, { key: action.payload.key, display_name: action.payload.display_name }]
          : state.postTypes.filter( postType => postType.key !== action.payload.key )
      };

    case FILTER_SOURCE_CHANGE:
      // if there is no payload, clear selected currentPostTypes
      if ( !action.payload ) {
        return { ...state, sources: [] };
      }
      return {
        ...state,
        sources: action.payload.checked
          ? [...state.sources, { key: action.payload.key, display_name: action.payload.display_name }]
          : state.sources.filter( source => source.display_name !== action.payload.display_name )
      };

    case FILTER_DATE_CHANGE:
      return {
        ...state,
        date: action.payload ? action.payload : { key: 'recent', display_name: 'Any Time' }
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
