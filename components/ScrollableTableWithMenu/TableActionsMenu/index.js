/**
 *
 * TableActionsMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox } from 'semantic-ui-react';
import editIcon from 'static/images/dashboard/edit.svg';
import createIcon from 'static/images/dashboard/create.svg';
import deleteIcon from 'static/images/dashboard/delete.svg';
import archiveIcon from 'static/images/dashboard/archive.svg';
import unpublishIcon from 'static/images/dashboard/unpublish.svg';
import './TableActionsMenu.scss';

/* eslint-disable react/prefer-stateless-function */
class TableActionsMenu extends React.Component {
  render() {
    const {
      displayActionsMenu, selectedItems, toggleAllItemsSelection
    } = this.props;

    return (
      <div className="actionsMenu_wrapper">
        <Checkbox
          className={ displayActionsMenu ? 'actionsMenu_toggle actionsMenu_toggle--active' : 'actionsMenu_toggle' }
          onChange={ toggleAllItemsSelection }
        />
        <div className={ displayActionsMenu ? 'actionsMenu active' : 'actionsMenu' }>
          <Button size="mini" basic>
            <img src={ editIcon } alt="Edit Selection(s)" title="Edit Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ deleteIcon } alt="Delete Selection(s)" title="Delete Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ unpublishIcon } alt="Unpublish Selection(s)" title="Unpublish Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ createIcon } alt="Create Selection(s)" title="Create Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ archiveIcon } alt="Archive Selection(s)" title="Archive Selection(s)" />
          </Button>
          <Button className="unpublish" size="mini" basic>
            |<span className="unpublish--text">Unpublish</span>
          </Button>
        </div>
      </div>
    );
  }
}

TableActionsMenu.propTypes = {
  displayActionsMenu: PropTypes.bool,
  selectedItems: PropTypes.object,
  toggleAllItemsSelection: PropTypes.func
};

export default TableActionsMenu;
