import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FilterMenuCountries from './FilterMenuCountries';

import './FilterSubMenu.scss';

const FilterSubMenu = props => {
  const {
    filter,
    filter: { postTypes },
  } = props;

  const renderSubMenu = () => {
    if ( postTypes.includes( 'document' ) ) {
      return (
        <section className="filterSubMenu">
          <hr />
          <span className="filterSubMenu_label"><b>Press Releases & Guidance: </b></span>
          <FilterMenuCountries selected={ filter.countries } />
        </section>
      );
    }

    return null;
  };

  return renderSubMenu();
};

FilterSubMenu.propTypes = {
  filter: PropTypes.object,
};

const mapStateToProps = state => ( {
  filter: state.filter,
} );

export default connect( mapStateToProps )( FilterSubMenu );
