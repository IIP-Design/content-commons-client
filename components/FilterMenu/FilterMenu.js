import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/filter';
import FilterMenuItem from './FilterMenuItem';
import FilterSelections from './FilterSelections';

import './FilterMenu.scss';

const areEqual = ( prevProps, nextProps ) => {
  const {
    filter: {
      categories, sources, postTypes, date
    }
  } = nextProps;

  const { filter: prevFilter } = prevProps;

  if (
    categories !== prevFilter.categories
    || sources !== prevFilter.sources
    || postTypes !== prevFilter.postTypes
    || date !== prevFilter.date
  ) {
    return false;
  }

  return true;
};

class FilterMenu extends Component {
  render() {
    const { filter, global } = this.props;

    return (
      <section className="filterMenu_wrapper">
        { /* SELECTION DISPLAY */ }
        <FilterSelections />

        <div className="filterMenu_main">
          { /*  MAIN-MENU */ }
          { /* Date */ }
          <FilterMenuItem
            filter="Date Range"
            name="date"
            selected={ filter.date }
            options={ global.dates.list }
            formItem="radio"
          />
          { /* Format */ }
          <FilterMenuItem
            filter="Format"
            name="postTypes"
            selected={ filter.postTypes }
            options={ global.postTypes.list }
            formItem="checkbox"
          />
          { /* Source */ }
          <FilterMenuItem
            filter="Source"
            name="sources"
            selected={ filter.sources }
            options={ global.sources.list }
            formItem="checkbox"
          />
          { /* Category */ }
          <FilterMenuItem
            filter="Category"
            name="categories"
            selected={ filter.categories }
            options={ global.categories.list }
            formItem="checkbox"
          />
        </div>
      </section>
    );
  }
}

FilterMenu.propTypes = {
  filter: PropTypes.object,
  global: PropTypes.object
};

const mapStateToProps = state => ( {
  search: state.search,
  filter: state.filter,
  global: state.global
} );

export default connect( mapStateToProps, actions )( React.memo( FilterMenu, areEqual ) );
