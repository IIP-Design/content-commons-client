import { combineReducers } from 'redux';

import languagesReducer from './languages';
import categoriesReducer from './categories';
import postTypesReducer from './postTypes';
import sourcesReducer from './sources';
import dateRangesReducer from './dateRanges';

export default combineReducers( {
  languages: languagesReducer,
  categories: categoriesReducer,
  postTypes: postTypesReducer,
  sources: sourcesReducer,
  dateRanges: dateRangesReducer
} );
