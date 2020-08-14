import {
  LOAD_DOCUMENT_USES_PENDING,
  LOAD_DOCUMENT_USES_FAILED,
  LOAD_DOCUMENT_USES_SUCCESS,
} from '../constants';

export const loadDocumentUses = response => async dispatch => {
  const { data, error, loading } = await response;

  if ( loading || !data ) {
    dispatch( { type: LOAD_DOCUMENT_USES_PENDING } );
  }

  if ( error ) {
    return dispatch( { type: LOAD_DOCUMENT_USES_FAILED } );
  }

  if ( data?.documentUses ) {
    const payload = data.documentUses.map( use => ( {
      display_name: use.name,
      key: use.name,
      submenu: 'document',
    } ) );

    return dispatch( {
      type: LOAD_DOCUMENT_USES_SUCCESS,
      payload,
    } );
  }
};
