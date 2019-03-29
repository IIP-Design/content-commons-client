import {
  CLEAR_FILTERS,
  FILTER_CATEGORY_CHANGE,
  FILTER_POST_TYPE_CHANGE,
  FILTER_SOURCE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_TO_DATE_CHANGE,
  FILTER_FROM_DATE_CHANGE
} from '../constants';

const INITIAL_STATE = {
  categories: [],
  sources: [],
  postTypes: [],
  dateFrom: new Date(),
  dateTo: new Date(),
  date: 'recent'
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case CLEAR_FILTERS:

      return {
        ...state,
        ...INITIAL_STATE
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
