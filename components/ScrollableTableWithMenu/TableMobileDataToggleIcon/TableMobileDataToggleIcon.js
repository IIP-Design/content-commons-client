/**
 *
 * TableMobileDataToggleIcon
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import './TableMobileDataToggleIcon.scss';

const TableMobileDataToggleIcon = ( { isOpen, toggleDisplay } ) => (
  <Icon
    name={ `chevron ${isOpen ? 'up' : 'down'}` }
    className="items_table_mobileDataToggleIcon"
    onClick={ toggleDisplay }
  />
);

TableMobileDataToggleIcon.propTypes = {
  isOpen: PropTypes.bool,
  toggleDisplay: PropTypes.func,
};

export default TableMobileDataToggleIcon;
