/*
 *
 * Recents actions
 *
 */


import { normalizeItem } from '../../lib/elastic/parser';
import { typeRecentsRequest } from '../../lib/elastic/api';
import { isDataStale } from '../../lib/utils';
import {
  LOAD_RECENTS_PENDING,
  LOAD_RECENTS_FAILED,
  LOAD_RECENTS_SUCCESS
} from './constants';

export const loadRecents = ( postType, locale ) => async ( dispatch, getState ) => {
  const timeSinceLastLoad = getState().recents[postType].lastLoad;
  const isStale = isDataStale( timeSinceLastLoad );

  // deal with server errors and axios
  if ( isStale ) {
    dispatch( {
      type: LOAD_RECENTS_PENDING,
      payload: { postType }
    } );

    let response;
    let items = [];
    try {
      response = await typeRecentsRequest( postType, locale );
    } catch ( err ) {
      return dispatch( {
        type: LOAD_RECENTS_FAILED,
        payload: { postType }
      } );
    }

    if ( response && response.hits && response.hits.hits ) {
      items = response.hits.hits.map( item => normalizeItem( item, locale ) );
    }

    return dispatch( {
      type: LOAD_RECENTS_SUCCESS,
      payload: {
        postType,
        items
      }
    } );
  }
};
