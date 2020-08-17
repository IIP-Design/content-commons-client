import {
  LOAD_BUREAUS_OFFICES_PENDING,
  LOAD_BUREAUS_OFFICES_FAILED,
  LOAD_BUREAUS_OFFICES_SUCCESS,
} from '../constants';

export const loadBureausOffices = response => async dispatch => {
  const { data, error, loading } = await response;

  if ( loading || !data ) {
    dispatch( { type: LOAD_BUREAUS_OFFICES_PENDING } );
  }

  if ( error ) {
    return dispatch( { type: LOAD_BUREAUS_OFFICES_FAILED } );
  }

  if ( data?.bureaus ) {
    const payload = data.bureaus.map( use => ( {
      display_name: use.name,
      key: use.name,
      submenu: 'document',
    } ) );

    return dispatch( {
      type: LOAD_BUREAUS_OFFICES_SUCCESS,
      payload,
    } );
  }
};
