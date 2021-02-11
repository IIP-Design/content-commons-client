import {
  LOAD_POST_TYPES_PENDING,
  LOAD_POST_TYPES_FAILED,
  LOAD_POST_TYPES_SUCCESS,
} from '../constants';

const INITIAL_STATE = {
  error: false,
  list: [],
  loading: false,
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_POST_TYPES_PENDING:
      return {
        ...state,
        loading: true,
      };

    case LOAD_POST_TYPES_FAILED:
      return {
        ...state,
        ...INITIAL_STATE,
        error: true,
        loading: false,
      };

    case LOAD_POST_TYPES_SUCCESS:
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
