import { createSelector } from 'reselect';

/**
 * Direct selectors
 */
const selectRecents = state => state.recents;
const selectRecentsByType = ( state, props ) => state.recents[props.postType].list;
const selectRecentsLoading = ( state, props ) => state.recents[props.postType].loading;
const selectRecentsError = ( state, props ) => state.recents[props.postType].error;

/**
 * Selector factories: returns selector instances
 */
const makeSelectRecentsByType = () => createSelector( selectRecentsByType, recents => recents );

const makeSelectRecentsWithMeta = () => createSelector( selectRecentsByType, recents => {
  let items = [];

  items = recents.map( item => {
    const categories = item.categories.reduce( ( acc, cat, index, arr ) => {
      const c = acc + cat.name.toLowerCase();
      return ( index < arr.length - 1 ) ? `${c} · ` : c;
    }, '' );

    return { ...item, categories };
  } );


  return items;
} );

const makeSelectLoading = () => createSelector( selectRecentsLoading, loading => loading );
const makeSelectError = () => createSelector( selectRecentsError, error => error );

export {
  selectRecents,
  makeSelectRecentsByType,
  makeSelectRecentsWithMeta,
  makeSelectLoading,
  makeSelectError
};
