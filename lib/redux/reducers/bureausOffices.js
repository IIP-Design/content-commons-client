import {
  LOAD_BUREAUS_OFFICES_PENDING,
  LOAD_BUREAUS_OFFICES_FAILED,
  LOAD_BUREAUS_OFFICES_SUCCESS,
} from '../constants';

const INITIAL_STATE = {
  error: false,
  list: [],
  loading: false,
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_BUREAUS_OFFICES_PENDING:
      return {
        ...state,
        loading: true,
      };

    case LOAD_BUREAUS_OFFICES_FAILED:
      return {
        ...state,
        error: true,
        loading: false,
      };

    case LOAD_BUREAUS_OFFICES_SUCCESS:
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
