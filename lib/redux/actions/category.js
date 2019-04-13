import { AggsRequest, categoryPrimaryRequest, categoryValueNameRequest } from 'lib/elastic/api';
import { titleCase } from 'lib/utils';

import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import {
  LOAD_CATEGORIES_PENDING,
  LOAD_CATEGORIES_FAILED,
  LOAD_CATEGORIES_SUCCESS
} from '../constants';

export const loadCategories = () => async ( dispatch, getState ) => {
  dispatch( { type: LOAD_CATEGORIES_PENDING } );

  let response;
  let primary;
  const currentState = getState();

  try {
    response = await AggsRequest( currentState );
    primary = await categoryPrimaryRequest();
  } catch ( err ) {
    return dispatch( { type: LOAD_CATEGORIES_FAILED } );
  }

  // get primary categories
  const primaryCategories = primary.hits.hits.map( category => category._source.language.en );

  // get all category ids that have associated content
  const allIds = [...response.aggregations.id.buckets, ...response.aggregations.unitId.buckets];

  const selections = currentState.filter.categories;

  selections.filter( selection => !allIds.find( id => id.key === selection ) ).forEach( selection => {
    allIds.push( {
      key: selection,
      doc_count: 0
    } );
  } );

  // get associated category name from id arr of unique values
  const categoryNameValuePairs = await categoryValueNameRequest( uniqBy( allIds, 'key' ) );

  // onlu include category if it is a primary
  const primaryCats = categoryNameValuePairs.hits.hits.filter(
    category => primaryCategories.includes( category._source.language.en )
  );

  // sort list
  const sorted = sortBy( primaryCats, [o => o._source.language.en] );

  // only display primary categories that have associated content
  const payload = sorted.map( category => ( {
    key: category._id,
    display_name: titleCase( category._source.language.en ),
    count: category.doc_count
  } ) );

  return dispatch( {
    type: LOAD_CATEGORIES_SUCCESS,
    payload
  } );
};
