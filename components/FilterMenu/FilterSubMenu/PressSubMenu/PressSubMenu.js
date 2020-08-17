import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FilterMenuCountries from './FilterMenuCountries';
import ReleaseTypeSubmenu from './ReleaseTypeSubmenu';
import BureausOfficesSubmenu from './BureausOfficesSubmenu';

const PressSubMenu = props => {
  const {
    filter: { countries, documentUses, bureausOffices },
  } = props;

  return (
    <section className="filterSubMenu">
      <hr />
      <span className="filterSubMenu_label"><b>Press Releases & Guidance: </b></span>
      <ReleaseTypeSubmenu selected={ documentUses } />
      <BureausOfficesSubmenu selected={ bureausOffices } />
      <FilterMenuCountries selected={ countries } />
    </section>
  );
};

PressSubMenu.propTypes = {
  filter: PropTypes.object,
};

const mapStateToProps = state => ( {
  filter: state.filter,
} );

export default connect( mapStateToProps )( PressSubMenu );
