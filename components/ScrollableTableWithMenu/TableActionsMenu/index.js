/**
 *
 * TableActionsMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import editIcon from 'static/images/dashboard/edit.svg';
import createIcon from 'static/images/dashboard/create.svg';
import deleteIcon from 'static/images/dashboard/delete.svg';
import archiveIcon from 'static/images/dashboard/archive.svg';
import unpublishIcon from 'static/images/dashboard/unpublish.svg';
import './TableActionsMenu.css';

/* eslint-disable react/prefer-stateless-function */
class TableActionsMenu extends React.Component {
  render() {
    const { displayActionsMenu, toggleAllItemsSelection } = this.props;
    return (
      <div className="actionsMenu_wrapper">
        <Checkbox
          className={ displayActionsMenu ? 'actionsMenu_toggle actionsMenu_toggle--active' : 'actionsMenu_toggle' }
          onChange={ toggleAllItemsSelection }
        />
        <div className={ displayActionsMenu ? 'actionsMenu active' : 'actionsMenu' }>
          <img src={ editIcon } alt="Edit Selection(s)" title="Edit Selection(s)" />
          <img src={ deleteIcon } alt="Delete Selection(s)" title="Delete Selection(s)" />
          <img src={ unpublishIcon } alt="Unpublish Selection(s)" title="Unpublish Selection(s)" />
          <img src={ createIcon } alt="Create Selection(s)" title="Create Selection(s)" />
          <img src={ archiveIcon } alt="Archive Selection(s)" title="Archive Selection(s)" />
          <div className="unpublish">|<span className="unpublish--text">Unpublish</span></div>
        </div>

      </div>
    );
  }
}

TableActionsMenu.propTypes = {
  displayActionsMenu: PropTypes.bool,
  toggleAllItemsSelection: PropTypes.func
};

export default TableActionsMenu;
