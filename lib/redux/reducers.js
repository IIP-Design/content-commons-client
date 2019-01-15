import { combineReducers } from 'redux';

// global reducers
import globalReducer from './globalReducers';
// import authReducer from 'containers/Auth/reducer';

// frontend reducers
// import searchReducer from './search';
import recentsReducer from '../../components/Recents/reducer';


export default combineReducers( {
  // search: searchReducer,
  global: globalReducer,
  // auth: authReducer,
  recents: recentsReducer
} );
