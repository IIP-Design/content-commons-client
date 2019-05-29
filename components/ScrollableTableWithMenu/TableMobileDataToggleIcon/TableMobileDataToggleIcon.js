/**
 *
 * TableMobileDataToggleIcon
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import './TableMobileDataToggleIcon.scss';

const TableMobileDataToggleIcon = props => (
  <Icon
    name={ `chevron ${props.isOpen ? 'up' : 'down'}` }
    className="items_table_mobileDataToggleIcon"
    onClick={ props.toggleDisplay }
  />
);

TableMobileDataToggleIcon.propTypes = {
  isOpen: PropTypes.bool,
  toggleDisplay: PropTypes.func
};

export default TableMobileDataToggleIcon;
