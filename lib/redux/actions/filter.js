import {
  CLEAR_FILTERS,
  FILTER_CHANGE,
  FILTER_CATEGORY_CHANGE,
  FILTER_COUNTRY_CHANGE,
  FILTER_POST_TYPE_CHANGE,
  FILTER_SOURCE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_TO_DATE_CHANGE,
  FILTER_FROM_DATE_CHANGE,
} from '../constants';


export const clearFilters = () => ( {
  type: CLEAR_FILTERS,
} );

export const filterUpdate = filters => ( {
  type: FILTER_CHANGE,
  payload: filters,
} );

export const categoryUpdate = category => ( {
  type: FILTER_CATEGORY_CHANGE,
  payload: category,
} );

export const countryUpdate = country => ( {
  type: FILTER_COUNTRY_CHANGE,
  payload: country,
} );

export const postTypeUpdate = postType => ( {
  type: FILTER_POST_TYPE_CHANGE,
  payload: postType,
} );

export const sourceUpdate = source => ( {
  type: FILTER_SOURCE_CHANGE,
  payload: source,
} );

export const dateUpdate = date => ( {
  type: FILTER_DATE_CHANGE,
  payload: date,
} );

export const fromDateUpdate = date => ( {
  type: FILTER_FROM_DATE_CHANGE,
  payload: date,
} );

export const toDateUpdate = date => ( {
  type: FILTER_TO_DATE_CHANGE,
  payload: date,
} );
