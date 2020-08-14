import {
  LOAD_DOCUMENT_USES_PENDING,
  LOAD_DOCUMENT_USES_FAILED,
  LOAD_DOCUMENT_USES_SUCCESS,
} from '../constants';

const INITIAL_STATE = {
  error: false,
  list: [],
  loading: false,
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_DOCUMENT_USES_PENDING:
      return {
        ...state,
        loading: true,
      };

    case LOAD_DOCUMENT_USES_FAILED:
      return {
        ...state,
        error: true,
        loading: false,
      };

    case LOAD_DOCUMENT_USES_SUCCESS:
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
