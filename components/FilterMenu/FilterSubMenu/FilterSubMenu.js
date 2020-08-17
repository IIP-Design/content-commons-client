import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PressSubMenu from './PressSubMenu/PressSubMenu';

import './FilterSubMenu.scss';

const FilterSubMenu = props => {
  const {
    filter: { postTypes },
  } = props;

  const renderSubMenu = () => {
    if ( postTypes.includes( 'document' ) ) {
      return <PressSubMenu />;
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
