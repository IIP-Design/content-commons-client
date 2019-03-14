import {
  LOAD_LANGUAGES_PENDING,
  LOAD_LANGUAGES_FAILED,
  LOAD_LANGUAGES_SUCCESS
} from '../constants';

const INITIAL_STATE = {
  error: false,
  list: [],
  loading: false
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_LANGUAGES_PENDING:
      return {
        ...state,
        loading: true
      };

    case LOAD_LANGUAGES_FAILED:
      return {
        ...state,
        ...INITIAL_STATE,
        error: true,
        loading: false
      };

    case LOAD_LANGUAGES_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        list: action.payload
      };

    default:
      return state;
  }
};
