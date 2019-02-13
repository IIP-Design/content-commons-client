// import YALI/YLAI mappings
import { MAPPINGS } from 'lib/redux/actions/source';
import {
  CLEAR_FILTERS,
  FILTER_CATEGORY_CHANGE,
  FILTER_POST_TYPE_CHANGE,
  FILTER_SOURCE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_TO_DATE_CHANGE,
  FILTER_FROM_DATE_CHANGE
} from '../constants';


export const clearFilters = () => ( {
  type: CLEAR_FILTERS
} );

export const categoryUpdate = ( category, checked ) => ( {
  type: FILTER_CATEGORY_CHANGE,
  payload: category
} );

export const postTypeUpdate = postType => ( {
  type: FILTER_POST_TYPE_CHANGE,
  payload: postType
} );

/**
 * Return array of young leader owner keys if needed
 * If not, make the key an array so processing is consistent
 * @param {*} source payload from source action creator
 */
export const sourceUpdate = source => {
  if ( !source ) {
    return {
      type: FILTER_SOURCE_CHANGE,
      payload: source
    };
  }
  const item = MAPPINGS.find( mapping => mapping.display.includes( source.display_name ) );
  const key = item ? item.key : [source.key];
  return {
    type: FILTER_SOURCE_CHANGE,
    payload: { ...source, key }
  };
};

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
