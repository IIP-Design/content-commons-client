import { normalizeItem } from 'lib/elastic/parser';

/**
 * Get a string of up to three categories from a content item
 * @param {Object} item Normalized data for a give content item
 * @returns {string} Lowercase list of category names separated by ·
 */
export const getCategories = item => {
  const cats = item?.categories?.slice( 0, 3 ).reduce( ( acc, cat, index, arr ) => {
    const c = acc + cat.name.toLowerCase();

    return index < arr.length - 1 && index < 2 ? `${c} · ` : c;
  }, '' );

  return cats;
};

/**
 * Updates the the featured context
 * @param {Promise[]} array Group of promises that resolve the recents properties
 * @param {dispatch} dispatch A reducer dispatch function
 */
export const getFeatured = async ( array, dispatch ) => {
  await Promise.all( array )
    .then( resArr => {
      const priorities = {};
      const recents = {};
      let items;

      resArr.forEach( res => {
        if ( res?.data?.hits?.hits ) {
          items = res.data.hits.hits.map( item => normalizeItem( item, res.locale ) );

          switch ( res.component ) {
            case 'priorities':
              priorities[res.term] = items;
              break;
            case 'packages':
            case 'recents':
              recents[res.postType] = items;
              break;
            default:
              break;
          }
        }
      } );

      dispatch( {
        type: 'LOAD_FEATURED_SUCCESS',
        payload: {
          priorities,
          recents,
        },
      } );
    } )
    .catch( err => {
      dispatch( {
        type: 'LOAD_FEATURED_FAILED',
      } );
    } );
};
