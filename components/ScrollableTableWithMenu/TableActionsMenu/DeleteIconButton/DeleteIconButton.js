import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import deleteIcon from 'static/images/dashboard/delete.svg';

const DeleteIconButton = props => (
  <Popup
    trigger={ (
      <Button
        size="mini"
        basic
        onClick={ props.displayConfirmDelete }
      >
        <img src={ deleteIcon } alt="Delete Selection(s)" />
      </Button>
    ) }
    content="Delete Selection(s)"
    hideOnScroll
    inverted
    on={ ['hover', 'focus'] }
    size="mini"
  />
);

DeleteIconButton.propTypes = {
  displayConfirmDelete: PropTypes.func
};

export default DeleteIconButton;
