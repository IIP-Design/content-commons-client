import { capitalizeFirst } from 'lib/utils';
import { postTypeAggRequest } from 'lib/elastic/api';
import {
  LOAD_POST_TYPES_PENDING,
  LOAD_POST_TYPES_FAILED,
  LOAD_POST_TYPES_SUCCESS
} from '../constants';

export const loadPostTypes = isLoggedIn => async ( dispatch, getState ) => {
  if ( !getState().global.postTypes.list.length ) {
    dispatch( { type: LOAD_POST_TYPES_PENDING } );
    let response;
    try {
      response = await postTypeAggRequest( isLoggedIn ); // // uses authentication filter to set which types to display
    } catch ( err ) {
      return dispatch( { type: LOAD_POST_TYPES_FAILED } );
    }

    if ( response && response.aggregations ) {
      const { buckets } = response.aggregations.postType;
      const payload = buckets.filter( type => type.key !== 'courses' && type.key !== 'page' ).map( type => {
        let displayName = capitalizeFirst( type.key );
        if ( type.key === 'post' ) displayName = 'Article';
        if ( type.key === 'package' ) displayName = 'Guidance Packages';
        return {
          key: type.key,
          display_name: displayName,
          count: type.doc_count
        };
      } );

      return dispatch( {
        type: LOAD_POST_TYPES_SUCCESS,
        payload
      } );
    }
  }
};
