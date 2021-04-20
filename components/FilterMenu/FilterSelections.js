import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import { withRouter } from 'next/router';
import * as actions from 'lib/redux/actions/filter';
import { fetchQueryString } from 'lib/searchQueryString';
import difference from 'lodash/difference';
import FilterSelectionItem from './FilterSelectionItem';
import styles from './FilterSelections.module.scss';

/**
 * Format and return selection object to be used for tag display
 *
 * @param {array}  values - Selected values for a given filter, i.e ['video', 'post']
 * @param {string} name - Filter name, i.e 'postTypes'
 * @param {array} list - All values available for a particular filter, used to fetch the display name
 * @param {bool} isRadio - Does this filter allow multiple selections
 */
const getSelection = ( values, name, list, isRadio = false ) => {
  let filterSelections = values.map( value => {
    const label = list.find( item => item.key.indexOf( value ) !== -1 );

    return {
      value,
      label: label ? label.display_name : '',
      name,
      single: isRadio,
    };
  } );

  // don't add if label is not present as it indicates no content available for that filter type
  filterSelections = filterSelections.filter( sel => sel.label );

  // remove any possible duplicates (needed as some filters have multiple values, i.e YALI or YLAI)
  // eslint-disable-next-line no-extra-parens
  filterSelections = filterSelections.reduce( ( acc, val ) => (
    acc.findIndex( sel => sel.label === val.label ) < 0 ? [...acc, val] : acc
  ), [] );

  return filterSelections;
};

/**
 * Generate a selection array from the selected filters
 */
const getAllSelections = ( filter, global ) => {
  let selectedFilters = [];

  // manually set filter order due to Safari issue
  const filterOrder = [
    'date', 'postTypes', 'sources', 'categories', 'countries',
  ];

  // loop thru filters to build selection list
  filterOrder.forEach( key => {
    const value = filter[key];

    // Do not include 'package' postType in filter selections
    // if coming from guidance pkg 'Browse All' link
    if ( key === 'postTypes' && value.includes( 'package' ) ) return;

    const isCheckbox = Array.isArray( value );
    const values = isCheckbox ? value : [value];

    // Single select filter props need to be made plural to match their global list name
    const listName = key === 'date' ? `${key}s` : key;
    const { list } = global[listName];

    // generate selection object
    const filterSelections = getSelection( values, key, list, !isCheckbox );

    // update array
    selectedFilters = [...selectedFilters, ...filterSelections];
  } );

  return selectedFilters;
};

const FilterSelections = props => {
  const {
    router,
    filter,
    global,
    term,
    language,
    clearFilters,
  } = props;

  const [selections, setSelections] = useState( [] );

  useEffect( () => {
    setSelections( [...getAllSelections( filter, global )] );
  }, [filter] );

  /**
   * Reload results page with updated query params
   * @param {object} query - updated query params
   */
  const executeQuery = query => {
    router.replace( {
      pathname: '/results',
      query,
    } );
  };

  /**
   * Reset all filter to initial values
   */
  const handleClearAllFilters = async () => {
    await clearFilters();
    const query = fetchQueryString( { term, language } );

    executeQuery( query );
  };

  /**
   * Removes selected filter item
   * @param {object} item
   */
  const handleOnClick = item => {
    // Update state selections instead of waiting for router update which updates redux store
    const updatedSelections = selections.filter( sel => sel.value !== item.value );

    setSelections( [...updatedSelections] );

    const selectedItemsFromSpecificFilter = filter[item.name].slice( 0 );
    const filterItemList = global[item.name].list;
    const itemToRemove = filterItemList.find( l => l.key.indexOf( item.value ) !== -1 );
    // Some values have multiple search terms within the input value
    // i.e. YALI appears as Young African Leaders Initiative|Young African Leaders Initiative Network
    // so we split the value into array and to remove all
    const values = itemToRemove.key.split( '|' );

    // remove selected values
    const updatedArr = difference( selectedItemsFromSpecificFilter, values );

    // generate updated query string
    const query = fetchQueryString( {
      ...filter, [item.name]: updatedArr, term, language,
    } );

    executeQuery( query );
  };

  if ( selections.length === 0 ) return null;

  return (
    <div className={ styles.filterMenuSelections }>
      { selections.map( selection => (
        <FilterSelectionItem
          key={ v4() }
          value={ selection.value }
          label={ selection.label }
          name={ selection.name }
          single={ selection.single }
          onClick={ handleOnClick }
          className={ styles.label }
        />
      ) ) }
      { selections.length > 1 && ( // need to update to > 2 as defaults to 2
        <button
          className={ `${styles.label} ${styles.clear_filter}` }
          onClick={ handleClearAllFilters }
          type="button"
        >
          CLEAR ALL
        </button>
      ) }
    </div>
  );
};

FilterSelections.propTypes = {
  router: PropTypes.object,
  filter: PropTypes.object,
  global: PropTypes.object,
  term: PropTypes.string,
  language: PropTypes.string,
  clearFilters: PropTypes.func,
};

const mapStateToProps = state => ( {
  filter: state.filter,
  global: state.global,
  term: state.search.term,
  language: state.search.language,
} );

export default withRouter( connect( mapStateToProps, actions )( FilterSelections ) );
