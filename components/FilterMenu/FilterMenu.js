import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/filter';
import { getCount } from 'lib/utils';
import FilterMenuItem from './FilterMenuItem';
import FilterSelections from './FilterSelections';
import FilterMenuCountries from './FilterMenuCountries';

import './FilterMenu.scss';

// const areEqual = ( prevProps, nextProps ) => {
//   const {
//     filter: {
//       categories, sources, postTypes, date
//     }
//   } = nextProps;

//   const { filter: prevFilter } = prevProps;

//   if (
//     categories !== prevFilter.categories
//     || sources !== prevFilter.sources
//     || postTypes !== prevFilter.postTypes
//     || date !== prevFilter.date
//   ) {
//     return false;
//   }

//   return true;
// };

class FilterMenu extends Component {
  render() {
    const { filter, global } = this.props;

    const hasCategories = getCount( global.categories.list ) > 0;
    const hasFilterType = type => (
      filter.postTypes.some( postType => postType === type )
    );

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
          { hasCategories
            && (
              <FilterMenuItem
                filter="Category"
                name="categories"
                selected={ filter.categories }
                options={ global.categories.list }
                formItem="checkbox"
              />
            ) }

          { /* Countries */ }
          { /* can also display for package, but need to adj es query */ }
          { hasFilterType( 'document' ) && <FilterMenuCountries selected={ filter.countries } /> }
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

export default connect( mapStateToProps, actions )( FilterMenu );
