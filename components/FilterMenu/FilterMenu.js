import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/filter';
import { getCount } from 'lib/utils';
import FilterMenuItem from './FilterMenuItem';
import FilterSelections from './FilterSelections';
import FilterMenuCountries from './FilterMenuCountries';
import {
  categoryUpdate, countryUpdate, dateUpdate, postTypeUpdate, sourceUpdate,
} from 'lib/redux/actions/filter';

import './FilterMenu.scss';

const FilterMenu = ( { filter, global } ) => {
  const showMenuItem = item => {
    if ( item === 'document' ) {
      return global?.postTypes?.list.some( type => type.key === item ) || false;
    }

    return getCount( global?.[item].list ) > 0;
  };

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
          updater={ dateUpdate }
        />
        { /* Format */ }
        <FilterMenuItem
          filter="Format"
          name="postTypes"
          selected={ filter.postTypes }
          options={ global.postTypes.list }
          formItem="checkbox"
          updater={ postTypeUpdate }
        />
        { /* Source */ }
        <FilterMenuItem
          filter="Source"
          name="sources"
          selected={ filter.sources }
          options={ global.sources.list }
          formItem="checkbox"
          updater={ sourceUpdate }
        />
        { /* Category */ }
        { showMenuItem( 'categories' )
          && (
            <FilterMenuItem
              filter="Category"
              name="categories"
              selected={ filter.categories }
              options={ global.categories.list }
              formItem="checkbox"
              updater={ categoryUpdate }
            />
          ) }
        { /* Countries */ }
        { showMenuItem( 'document' ) && <FilterMenuCountries selected={ filter.countries } updater={ countryUpdate } /> }
      </div>
    </section>
  );
};

FilterMenu.propTypes = {
  filter: PropTypes.object,
  global: PropTypes.object,
};

const mapStateToProps = state => ( {
  search: state.search,
  filter: state.filter,
  global: state.global,
} );

export default connect( mapStateToProps, actions )( FilterMenu );
