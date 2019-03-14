import {
  CLEAR_FILTERS,
  FILTER_CATEGORY_CHANGE,
  FILTER_POST_TYPE_CHANGE,
  FILTER_SOURCE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_TO_DATE_CHANGE,
  FILTER_FROM_DATE_CHANGE,
  SEARCH_LANGUAGE_UPDATE
} from '../constants';


export const clearFilters = () => ( {
  type: CLEAR_FILTERS
} );

export const categoryUpdate = category => ( {
  type: FILTER_CATEGORY_CHANGE,
  payload: category
} );

export const postTypeUpdate = postType => ( {
  type: FILTER_POST_TYPE_CHANGE,
  payload: postType
} );

export const updateLanguage = payload => ( {
  type: SEARCH_LANGUAGE_UPDATE,
  payload
} );

export const sourceUpdate = source => ( {
  type: FILTER_SOURCE_CHANGE,
  payload: source
} );


export const dateUpdate = date => ( {
  type: FILTER_DATE_CHANGE,
  payload: date
} );

export const fromDateUpdate = date => ( {
  type: FILTER_FROM_DATE_CHANGE,
  payload: date
} );

export const toDateUpdate = date => ( {
  type: FILTER_TO_DATE_CHANGE,
  payload: date
} );
