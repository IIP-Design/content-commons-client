import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FilterMenuItem from 'components/FilterMenu/FilterMenuItem';

const BureausOfficesSubmenu = ( { selected, bureausOffices } ) => {
  const bureausOfficesOptions = bureausOffices.list;

  return (
    <FilterMenuItem
      className="subfilter"
      selected={ selected }
      filter="Bureaus & Offices"
      name="bureausOffices"
      options={ bureausOfficesOptions }
      formItem="checkbox"
    />
  );
};

const mapStateToProps = state => ( {
  bureausOffices: state.global.bureausOffices,
} );

BureausOfficesSubmenu.propTypes = {
  selected: PropTypes.array,
  bureausOffices: PropTypes.object,
};

export default connect( mapStateToProps )( BureausOfficesSubmenu );
