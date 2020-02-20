/*
 *
 * Featured actions
 *
 */


import { normalizeItem } from 'lib/elastic/parser';
import { typePrioritiesRequest, typeRecentsRequest, typeRequestDesc } from 'lib/elastic/api';
import { isDataStale } from 'lib/utils';
import { v4 } from 'uuid';
import {
  LOAD_FEATURED_PENDING,
  LOAD_FEATURED_FAILED,
  LOAD_FEATURED_SUCCESS
} from './constants';


export const loadFeatured = data => async ( dispatch, getState ) => {
  const timeSinceLastLoad = getState().featured.lastLoad;
  const isStale = isDataStale( timeSinceLastLoad );
  // deal with server errors and axios
  if ( isStale ) {
    dispatch( {
      type: LOAD_FEATURED_PENDING
    } );

    const promiseArr = data.map( d => {
      const { component, props } = d;
      switch ( component ) {
        case 'priorities':
          return typePrioritiesRequest( props.term, props.categories, props.locale ).then( res => ( {
            component,
            ...props,
            data: res,
            key: v4()
          } ) );
        case 'packages':
          return typeRequestDesc( props.postType ).then( res => ( {
            component,
            ...props,
            data: res,
            key: v4()
          } ) );
        case 'recents':
          return typeRecentsRequest( props.postType, props.locale ).then( res => ( {
            component,
            ...props,
            data: res,
            key: v4()
          } ) );
        default:
          return {};
      }
    } );
    await Promise.all( promiseArr ).then( resArr => {
      const priorities = {};
      const recents = {};
      let items;
      resArr.forEach( res => {
        if ( res.data && res.data.hits && res.data.hits.hits ) {
          items = res.data.hits.hits.map( item => normalizeItem( item, res.locale ) );
          switch ( res.component ) {
            case 'priorities':
              priorities[res.term] = items;
              break;
            case 'packages':
              recents[res.postType] = items;
              break;
            case 'recents':
              recents[res.postType] = items;
              break;
            default:
              break;
          }
        }
      } );
      dispatch( {
        type: LOAD_FEATURED_SUCCESS,
        payload: {
          priorities,
          recents
        }
      } );
    } ).catch( err => {
      dispatch( {
        type: LOAD_FEATURED_FAILED
      } );
    } );
  }
};
