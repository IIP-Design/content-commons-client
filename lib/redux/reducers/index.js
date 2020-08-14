import { combineReducers } from 'redux';

import languagesReducer from './languages';
import categoriesReducer from './categories';
import countriesReducer from './countries';
import documentUsesReducer from './documentUses';
import postTypesReducer from './postTypes';
import sourcesReducer from './sources';
import datesReducer from './dates';

export default combineReducers( {
  languages: languagesReducer,
  categories: categoriesReducer,
  countries: countriesReducer,
  documentUses: documentUsesReducer,
  postTypes: postTypesReducer,
  sources: sourcesReducer,
  dates: datesReducer,
} );
