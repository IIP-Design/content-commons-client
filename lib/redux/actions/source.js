import { AggsRequest } from 'lib/elastic/api';
import uniqBy from 'lodash/uniqBy';
import {
  LOAD_SOURCES_PENDING,
  LOAD_SOURCES_FAILED,
  LOAD_SOURCES_SUCCESS
} from '../constants';

/**
 * Owners name for the young leader sites are not completely standardized
 * so we standardize and send an array to enable search on all variants
 */
export const MAPPINGS = [
  {
    key: ['Young African Leaders Initiative', 'Young African Leaders Initiative Network'],
    display: 'YALI'
  },
  {
    key: ['Young Leaders of the Americas Initiative', 'Young Leaders of the Americas Initiative Network'],
    display: 'YLAI'
  }
];

/**
 * Fetch abbreviated name for young leader sites
 * @param {array} key owner key returned from ES index
 */
const normalizeDisplay = key => {
  const source = MAPPINGS.find( mapping => mapping.key.includes( key ) );
  return source ? source.display : key;
};

/**
 * Stringifys array of young leader keys if needed
 * @param {*} key owner key returned from ES index
 */
const normalizeKeys = key => {
  const source = MAPPINGS.find( mapping => mapping.key.includes( key ) );
  return source ? source.key.join( '|' ) : key;
};

export const loadSources = () => async ( dispatch, getState ) => {
  dispatch( { type: LOAD_SOURCES_PENDING } );

  let response;
  const currentState = getState();
  try {
    response = await AggsRequest( currentState );
  } catch ( err ) {
    return dispatch( { type: LOAD_SOURCES_FAILED } );
  }
  const { buckets } = response.aggregations.source;

  const sources = buckets.filter( bucket => bucket.key && bucket.key !== 'IIP Courses' ).map( bucket => ( {
    key: normalizeKeys( bucket.key ),
    display_name: normalizeDisplay( bucket.key ),
    count: bucket.doc_count
  } ) );

  const selections = currentState.filter.sources;

  selections.filter( selection => !sources.find( source => source.display_name === selection ) ).forEach( selection => {
    sources.push( {
      key: normalizeKeys( selection ),
      display_name: normalizeDisplay( selection ),
      count: 0
    } );
  } );

  // When doucment counts are introduced, we will need to add together all
  // counts form duplicates sources, i.e. Young African Leaders Initiative & Young African Leaders Initiative Network
  // will need to be totaled
  const payload = uniqBy( sources, 'key' );

  return dispatch( {
    type: LOAD_SOURCES_SUCCESS,
    payload
  } );
};
