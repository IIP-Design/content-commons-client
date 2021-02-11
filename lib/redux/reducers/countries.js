import {
  LOAD_COUNTRIES_PENDING,
  LOAD_COUNTRIES_FAILED,
  LOAD_COUNTRIES_SUCCESS,
} from '../constants';

const INITIAL_STATE = {
  error: false,
  list: [],
  loading: false,
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_COUNTRIES_PENDING:
      return {
        ...state,
        loading: true,
      };

    case LOAD_COUNTRIES_FAILED:
      return {
        ...state,
        ...INITIAL_STATE,
        error: true,
        loading: false,
      };

    case LOAD_COUNTRIES_SUCCESS:
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
