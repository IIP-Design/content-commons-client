import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import recentsReducer from 'components/Recents/reducer';
import uploadResolver from './reducers/upload';
import filterReducer from './reducers/filter';
import searchReducer from './reducers/search';
import globalReducer from './reducers';

const reducers = combineReducers( {
  upload: uploadResolver,
  search: searchReducer,
  filter: filterReducer,
  recents: recentsReducer,
  global: globalReducer,
} );

/*
Add redux dev tools: https://github.com/zalmoxisus/redux-devtools-extension
To use redux dev tools, ensure that you have added the applicable browser extension
Using logOnlyInProduction loads full featured version for development and the
restricted one for production based on process.env.NODE_ENV which is set in webpack
*/
const composeEnhancers = composeWithDevTools( {} );

/** Note:  On server render a new store is created
 *
* @param {object} initialState server hydrated initial state
* @param {boolean} options.isServer indicates whether it is a server side or client side
* @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
* @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
* @param {boolean} options.debug User-defined debug mode param
* @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
*/
// const makeStore = ( initialState, options ) => createStore( reducers, initialState, composeEnhancers( applyMiddleware( thunk ) ) );
const makeStore = ( initialState, options ) => createStore( reducers, initialState, composeEnhancers( applyMiddleware( thunk ) ) );

export default makeStore;
