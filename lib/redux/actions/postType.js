import { capitalizeFirst } from 'lib/utils';
import { postTypeAggRequest } from 'lib/elastic/api';
import {
  LOAD_POST_TYPES_PENDING,
  LOAD_POST_TYPES_FAILED,
  LOAD_POST_TYPES_SUCCESS
} from '../constants';

export const loadPostTypes = () => async ( dispatch, getState ) => {
  if ( !getState().global.postTypes.list.length ) {
    dispatch( { type: LOAD_POST_TYPES_PENDING } );

    let response;
    try {
      response = await postTypeAggRequest();
    } catch ( err ) {
      return dispatch( { type: LOAD_POST_TYPES_FAILED } );
    }

    if ( response && response.aggregations ) {
      const { buckets } = response.aggregations.postType;
      const payload = buckets.filter( type => type.key !== 'courses' && type.key !== 'page' ).map( type => ( {
        key: type.key,
        display_name: type.key === 'post' ? 'Article' : capitalizeFirst( type.key ),
        count: type.doc_count
      } ) );

      // TEMP - mock package postType
      const payloadWithPkgMock = [...payload, {
        key: 'package',
        display_name: 'Package',
        count: 20
      }];

      return dispatch( {
        type: LOAD_POST_TYPES_SUCCESS,
        payload: payloadWithPkgMock
      } );
    }
  }
};
