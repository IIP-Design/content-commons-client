/*
 *
 * Featured reducer
 *
 */
import {
  LOAD_FEATURED_PENDING,
  LOAD_FEATURED_FAILED,
  LOAD_FEATURED_SUCCESS
} from './constants';


const initialSingleState = {
  priorities: {},
  recents: {},
  loading: false,
  lastLoad: 0,
  error: false
};

export const INITIAL_STATE = { ...initialSingleState };

const setLoading = state => ( {
  ...state,
  loading: true,
  error: false
} );


const setError = state => ( {
  ...state,
  loading: false,
  error: true
} );


const setSuccess = ( state, action ) => ( {
  ...state,
  priorities: action.payload.priorities,
  recents: action.payload.recents,
  loading: false,
  error: false,
  lastLoad: Date.now()
} );


export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_FEATURED_PENDING:
      return setLoading( state );

    case LOAD_FEATURED_FAILED:
      return setError( state );

    case LOAD_FEATURED_SUCCESS:
      return setSuccess( state, action );

    default:
      return state;
  }
};
