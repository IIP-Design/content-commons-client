import {
  SEARCH_REQUEST_PENDING,
  SEARCH_REQUEST_FAILED,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_PAGE_PENDING,
  SEARCH_PAGE_FAILED,
  SEARCH_PAGE_SUCCESS,
  SEARCH_SORT_PENDING,
  SEARCH_SORT_FAILED,
  SEARCH_SORT_SUCCESS,
  SEARCH_SORT_UPDATE,
  SEARCH_TERM_UPDATE,
  SEARCH_LANGUAGE_UPDATE,
} from '../constants';

const INITIAL_STATE = {
  currentPage: -1,
  endIndex: 0,
  endPage: 0,
  error: '',
  isFetching: false,
  pageSize: 12,
  pages: [],
  response: {},
  sort: 'relevance',
  term: '',
  language: 'en-us',
  currentTerm: '',
  startIndex: 0,
  startPage: 1,
  total: 0,
  totalPages: 0,
};

const search = ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case SEARCH_SORT_UPDATE:
      return {
        ...state,
        sort: action.payload,
      };

    case SEARCH_REQUEST_PENDING:
      return {
        ...state,
        isFetching: true,
        error: false,
      };

    case SEARCH_REQUEST_FAILED:
      return {
        INITIAL_STATE,
        ...state,
        isFetching: false,
        error: true,
      };

    case SEARCH_REQUEST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        ...action.payload,
      };

    case SEARCH_PAGE_PENDING:
      return {
        ...state,
        isFetching: true,
        error: false,
      };

    case SEARCH_PAGE_FAILED:
      return {
        INITIAL_STATE,
        ...state,
        isFetching: false,
        error: true,
      };

    case SEARCH_PAGE_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isFetching: false,
      };

    case SEARCH_SORT_PENDING:
      return {
        ...state,
        ...action.payload,
      };

    case SEARCH_SORT_FAILED:
      return {
        ...INITIAL_STATE,
        ...state,
        isFetching: false,
        error: true,
      };

    case SEARCH_SORT_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isFetching: false,
      };

    case SEARCH_TERM_UPDATE:
      return {
        ...state,
        term: action.payload,
      };

    case SEARCH_LANGUAGE_UPDATE:
      return {
        ...state,
        language: action.payload,
      };

    default:
      return state;
  }
};

export default search;
