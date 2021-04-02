import {
  LOAD_SOURCES_PENDING,
  LOAD_SOURCES_FAILED,
  LOAD_SOURCES_SUCCESS,
} from '../constants';

export const INITIAL_STATE = {
  error: false,
  list: [],
  loading: false,
};

const sources = ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_SOURCES_PENDING:
      return {
        ...state,
        loading: true,
      };

    case LOAD_SOURCES_FAILED:
      return {
        ...state,
        ...INITIAL_STATE,
        error: true,
        loading: false,
      };

    case LOAD_SOURCES_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        list: action.payload,
      };

    default:
      return state;
  }
};

export default sources;
