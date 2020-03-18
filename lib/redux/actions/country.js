import { countriesAggRequest } from 'lib/elastic/api';
import {
  LOAD_COUNTRIES_PENDING,
  LOAD_COUNTRIES_FAILED,
  LOAD_COUNTRIES_SUCCESS
} from '../constants';

export const loadCountries = () => async ( dispatch, getState ) => {
  dispatch( { type: LOAD_COUNTRIES_PENDING } );

  let response;

  // Fetch countries with content
  try {
    response = await countriesAggRequest();
  } catch ( err ) {
    return dispatch( { type: LOAD_COUNTRIES_FAILED } );
  }

  if ( response?.aggregations?.countries ) {
    const { buckets } = response.aggregations.countries;
    const payload = buckets.map( country => ( {
      count: country.doc_count,
      display_name: country.key,
      key: country.key
    } ) );

    return dispatch( {
      type: LOAD_COUNTRIES_SUCCESS,
      payload
    } );
  }
};
