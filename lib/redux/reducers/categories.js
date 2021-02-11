import {
  LOAD_CATEGORIES_PENDING,
  LOAD_CATEGORIES_FAILED,
  LOAD_CATEGORIES_SUCCESS,
} from '../constants';

const INITIAL_STATE = {
  error: false,
  list: [],
  loading: false,
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_CATEGORIES_PENDING:
      return {
        ...state,
        loading: true,
      };

    case LOAD_CATEGORIES_FAILED:
      return {
        ...state,
        ...INITIAL_STATE,
        error: true,
        loading: false,
      };

    case LOAD_CATEGORIES_SUCCESS:
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
