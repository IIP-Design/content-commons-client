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
    const bureausCollection = data.bureaus.map( bureau => ( {
      display_name: bureau.name,
      key: bureau.name,
      isBureau: bureau.isBureau,
      submenu: 'document',
    } ) );

    const officesCollection = data.bureaus
      .filter( bureau => bureau.offices.length > 0 )
      .reduce( ( offices, bureau ) => {
        const formatOffices = bureau.offices.map( office => ( {
          display_name: office.name,
          key: office.name,
          submenu: 'document',
        } ) );

        return [...offices, ...formatOffices];
      }, [] );

    const payload = [...bureausCollection, ...officesCollection];

    return dispatch( {
      type: LOAD_BUREAUS_OFFICES_SUCCESS,
      payload,
    } );
  }
};
