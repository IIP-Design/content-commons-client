import { categoryAggRequest, categoryPrimaryRequest, categoryValueNameRequest } from 'utils/api';
import { titleCase } from 'utils/helpers';
import {
  LOAD_CATEGORIES_PENDING,
  LOAD_CATEGORIES_FAILED,
  LOAD_CATEGORIES_SUCCESS
  // CATEGORY_CHANGE
} from 'containers/App/constants';

import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

// export const categoryUpdate = ( category, checked ) => ( {
//   type: CATEGORY_CHANGE,
//   payload: category
// } );

export const loadCategories = () => async dispatch => {
  dispatch( { type: LOAD_CATEGORIES_PENDING } );

  let response;
  let primary;
  try {
    response = await categoryAggRequest();
    primary = await categoryPrimaryRequest();
  } catch ( err ) {
    return dispatch( { type: LOAD_CATEGORIES_FAILED } );
  }

  // get primary categories
  const primaryCategories = primary.hits.hits.map( category => category._source.language.en );

  // get all category ids that have associated content
  const allIds = [...response.aggregations.id.buckets, ...response.aggregations.unitId.buckets];

  // get associated category name from id arr of unique values
  const categoryNameValuePairs = await categoryValueNameRequest( uniqBy( allIds, 'key' ) );

  // onlu include category if it is a primary
  const primaryCats = categoryNameValuePairs.hits.hits.filter( category => primaryCategories.includes( category._source.language.en ) );

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
