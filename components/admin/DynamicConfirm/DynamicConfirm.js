/*
  DynamicConfirm component allows the reuse of the Confirm component within a parent component.
  In other words, multiple <Confirm/> components do not need to be added to the parent nor do multiple
  open states need to be tracked.  Created this as opposed to just using semantic <Confirm/>
  as it makes use of the ConfirmModalContent components.
  NOTE: Consider moving this to a hook or hOC??
*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Confirm } from 'semantic-ui-react';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import './DynamicConfirm.scss';

const DynamicConfirm = props => {
  const {
    open,
    headline,
    content,
    cancelButton,
    confirmButton,
    onCancel,
    onConfirm,
  } = props;

  const [show, setShow] = useState( false );

  useEffect( () => {
    setShow( open );
  }, [open] );


  return (
    <Confirm
      className="remove-file"
      open={ show }
      content={ (
        <ConfirmModalContent
          className="delete_confirm delete_confirm--video"
          headline={ headline }
        >
          <p>{ content }</p>
        </ConfirmModalContent>
      ) }
      onCancel={ onCancel }
      onConfirm={ onConfirm }
      cancelButton={ cancelButton }
      confirmButton={ confirmButton }
    />
  );
};

DynamicConfirm.propTypes = {
  open: PropTypes.bool,
  headline: PropTypes.string,
  content: PropTypes.string,
  cancelButton: PropTypes.string,
  confirmButton: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

DynamicConfirm.defaultProps = {
  open: false,
  headline: '',
  content: '',
  cancelButton: 'Cancel',
  confirmButton: 'OK',
};

export default DynamicConfirm;
