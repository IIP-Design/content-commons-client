import {
  LOAD_COUNTRIES_PENDING,
  LOAD_COUNTRIES_FAILED,
  LOAD_COUNTRIES_SUCCESS,
} from '../constants';

export const loadCountries = response => async ( dispatch, getState ) => {
  const { data, error, loading } = await response;

  if ( loading || !data ) {
    dispatch( { type: LOAD_COUNTRIES_PENDING } );
  }

  if ( error ) {
    return dispatch( { type: LOAD_COUNTRIES_FAILED } );
  }

  if ( data?.countries ) {
    const payload = data.countries.map( country => ( {
      display_name: country.name,
      key: country.name,
      submenu: 'document',
    } ) );

    return dispatch( {
      type: LOAD_COUNTRIES_SUCCESS,
      payload,
    } );
  }
};
