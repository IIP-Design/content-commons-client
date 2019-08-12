import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Confirm } from 'semantic-ui-react';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';

const FileConfirm = props => {
  const {
    open,
    headline,
    content,
    cancelButton,
    confirmButton,
    handleOnCancel,
    handleOnConfirm
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
          <p style={ { whiteSpace: 'pre-line' } }>{ content }</p>
        </ConfirmModalContent>
    ) }
      onCancel={ handleOnCancel }
      onConfirm={ handleOnConfirm }
      cancelButton={ cancelButton }
      confirmButton={ confirmButton }
    />
  );
};

FileConfirm.propTypes = {
  open: PropTypes.bool,
  headline: PropTypes.string,
  content: PropTypes.string,
  cancelButton: PropTypes.string,
  confirmButton: PropTypes.string,
  handleOnCancel: PropTypes.func,
  handleOnConfirm: PropTypes.func
};

FileConfirm.defaultProps = {
  open: false,
  headline: 'Are you sure you want to delete this video project?',
  content: 'This video project will be permanently removed from the Content Cloud. Any videos that you uploaded here will not be uploaded.',
  cancelButton: 'Cancel',
  confirmButton: 'OK'
};

export default FileConfirm;
