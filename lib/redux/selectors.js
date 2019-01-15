/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

/**
 * Direct selectors
 */
const selectGlobal = state => state.global;
const selectPostTypes = state => state.global.postTypes.list;


// const makeSelectSources = () =>
//   createSelector( selectGlobal, globalState => globalState.sources );

/**
 * Selector factories: returns selector instances
 */
const makeSelectPostTypes = () => createSelector( selectPostTypes, postTypes => postTypes );

const makeSelectPostTypeLabel = props => createSelector( selectPostTypes, postTypes => {
  const postType = postTypes.find( item => item.key === props.postType );
  return ( postType && postType.display_name ) ? postType.display_name : '';
} );


// const makeSelectPostTypes = createSelector( selectPostTypes, postTypes => postTypes );


export {
  selectGlobal,
  // makeSelectLanguages,
  // makeSelectCategories,
  // makeSelectSources,
  makeSelectPostTypes,
  makeSelectPostTypeLabel
};
