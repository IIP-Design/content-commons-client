import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import { withRouter } from 'next/router';
import * as actions from 'lib/redux/actions/filter';
import { fetchQueryString } from 'lib/searchQueryString';
import difference from 'lodash/difference';
import FilterSelectionItem from './FilterSelectionItem';
import './FilterSelections.scss';

class FilterSelections extends Component {
  /**
   * Reload results page with updated query params
   * @param {object} query - updated query params
   */
  executeQuery = query => {
    this.props.router.replace( {
      pathname: '/results',
      query
    } );
  }

  /**
   * Removes selected filter item
   * @param {object} item
   */
  handleOnClick = item => {
    const {
      filter, global, term, language
    } = this.props;

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
      ...filter, [item.name]: updatedArr, term, language
    } );

    this.executeQuery( query );
  }

  /**
   * Reset all filter to initial values
   */
  handleClearAllFilters = async () => {
    await this.props.clearFilters();

    const { filter, term, language } = this.props;
    const query = fetchQueryString( { ...filter, term, language } );

    this.executeQuery( query );
  }

  /**
   * Format and return selection object to be used for tag display
   *
   * @param {array}  values - Selected values for a given filter, i.e ['video', 'post']
   * @param {string} name - Filter name, i.e 'postTypes'
   * @param {array} list - All values available for a particular filter, used to fetch the display name
   * @param {bool} isRadio - Does this filter allow multiple selections
   */
  getSelection = ( values, name, list, isRadio = false ) => {
    // Filter out packages from the filter selections
    const filtered = values.filter(val => val !== 'package');

    let selections = filtered.map( value => {
      const label = list.find( item => item.key.indexOf( value ) !== -1 );
      return ( {
        value,
        label: label ? label.display_name : '',
        name,
        single: isRadio
      } );
    } );

    // remove any possible duplicates (needed as some filters have multiple values, i.e YALI or YLAI)
    selections = selections.reduce( ( acc, val ) => (
      acc.findIndex( sel => sel.label === val.label ) < 0 ? [...acc, val] : acc
    ), [] );
    return selections;
  }

  /**
   * Generate a selection array from the selected filters
   */
  getAllSelections = () => {
    let selections = [];
    const { filter, global } = this.props;

    // manually set filter order due to Safari issue
    const filterOrder = ['date', 'postTypes', 'sources', 'categories'];

    // loop thru filters to build selection list
    filterOrder.forEach( key => {
      const value = filter[key];
      
      const isCheckbox = Array.isArray( value );
      const values = isCheckbox ? value : [value];

      // Single select filter props need to be made plural to match their global list name
      const listName = ( key === 'date' ) ? `${key}s` : key;
      const { list } = global[listName];

      // generate selection object
      const itemSelections = this.getSelection( values, key, list, !isCheckbox );

      // update array
      selections = [...selections, ...itemSelections];
    } );

    return selections;
  }


  render() {
    const selections = this.getAllSelections();

    if ( !selections.length ) {
      return <div />;
    }

    return (
      <div className="filterMenu_selections">
        { selections.map( selection => (
          <FilterSelectionItem
            key={ v4() }
            value={ selection.value }
            label={ selection.label }
            name={ selection.name }
            single={ selection.single }
            onClick={ this.handleOnClick }
          />
        ) ) }
        { selections.length > 1 && ( // need to update to > 2 as defaults to 2
          <div
            className="ui label clear_filter"
            onClick={ this.handleClearAllFilters }
            onKeyDown={ this.handleClearAllFilters }
            role="button"
            tabIndex={ 0 }
          >
            CLEAR ALL
          </div>
        ) }
      </div>
    );
  }
}

FilterSelections.propTypes = {
  router: PropTypes.object,
  filter: PropTypes.object,
  global: PropTypes.object,
  term: PropTypes.string,
  language: PropTypes.string,
  clearFilters: PropTypes.func
};

const mapStateToProps = state => ( {
  filter: state.filter,
  global: state.global,
  term: state.search.term,
  language: state.search.language
} );

export default withRouter( connect( mapStateToProps, actions )( FilterSelections ) );
