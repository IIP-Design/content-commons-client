import { capitalizeFirst } from 'lib/utils';
import { normalizeItem } from 'lib/elastic/parser';
import { postTypeAggRequest } from 'lib/elastic/api';

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
  const resArr = await Promise.all( array ).catch( err => {
    dispatch( {
      type: 'LOAD_FEATURED_FAILED',
    } );
  } );

  console.dir( resArr );

  const priorities = {};
  const recents = {};
  let items;

  if ( resArr ) {
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
  }
};


/**
 *
 * @param {dispatch} dispatch A reducer dispatch function
 * @param {Object} user User date object
 */
export const loadPostTypes = async ( dispatch, user ) => {
  dispatch( { type: 'LOAD_POST_TYPES_PENDING' } );

  let response;

  try {
    response = await postTypeAggRequest( user );
  } catch ( err ) {
    dispatch( { type: 'LOAD_POST_TYPES_FAILED' } );

    return;
  }

  if ( response?.aggregations?.postType?.buckets ) {
    const { buckets } = response.aggregations.postType;

    const filtered = buckets.filter( type => type.key !== 'courses' && type.key !== 'page' && type.key !== 'package' );

    const payload = filtered.map( type => {
      let displayName = capitalizeFirst( type.key );

      if ( type.key === 'post' ) displayName = 'Article';
      if ( type.key === 'document' ) displayName = 'Press Releases and Guidance';

      return {
        key: type.key,
        display_name: displayName,
        count: type.doc_count,
      };
    } );

    dispatch( {
      type: 'LOAD_POST_TYPES_SUCCESS',
      payload,
    } );
  } else {
    dispatch( {
      type: 'LOAD_POST_TYPES_SUCCESS',
      payload: [],
    } );
  }
};
