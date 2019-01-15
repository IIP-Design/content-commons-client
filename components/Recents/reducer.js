/*
 *
 * Recents reducer
 *
 */
import {
  LOAD_RECENTS_PENDING,
  LOAD_RECENTS_FAILED,
  LOAD_RECENTS_SUCCESS
} from './constants';


const initialSingleState = {
  list: [],
  loading: false,
  lastLoad: 0,
  error: false
};

export const INITIAL_STATE = {
  video: { ...initialSingleState },
  post: { ...initialSingleState }
};

const setLoading = ( state, action ) => {
  const recentByType = state[action.payload.postType];

  return {
    ...state,
    [action.payload.postType]: {
      ...recentByType,
      loading: true,
      error: false
    }
  };
};

const setError = ( state, action ) => {
  const recentByType = state[action.payload.postType];
  return {
    ...state,
    [action.payload.postType]: {
      ...recentByType,
      loading: false,
      error: true
    }
  };
};


const setSuccess = ( state, action ) => ( {
  ...state,
  [action.payload.postType]: {
    list: action.payload.items,
    loading: false,
    error: false,
    lastLoad: Date.now()
  }
} );


export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_RECENTS_PENDING:
      return setLoading( state, action );

    case LOAD_RECENTS_FAILED:
      return setError( state, action );

    case LOAD_RECENTS_SUCCESS:
      return setSuccess( state, action );

    default:
      return state;
  }
};
