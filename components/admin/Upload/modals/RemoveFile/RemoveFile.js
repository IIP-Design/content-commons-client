import React from 'react';
import PropTypes from 'prop-types';
import { Confirm } from 'semantic-ui-react';
import ConfirmModalContent from '../../../ConfirmModalContent/ConfirmModalContent';

const RemoveFile = props => {
  const { filename, closeModal } = props;
  const modalOpen = filename !== null;
  return (
    <Confirm
      className="remove-file"
      open={ modalOpen }
      content={ (
        <ConfirmModalContent
          className="remove-file__content"
          headline="Are you sure you want to remove this file?"
        >
          <p>You are about to remove { filename }. This file will not be uploaded with this project.</p>
        </ConfirmModalContent>
      ) }
      onCancel={ () => closeModal() }
      onConfirm={ () => closeModal( true ) }
      cancelButton="No, take me back"
      confirmButton="Yes, remove"
    />
  );
};

RemoveFile.propTypes = {
  closeModal: PropTypes.func,
  filename: PropTypes.string,
};

RemoveFile.defaultProps = {
  filename: null,
  closeModal: () => {}
};

export default RemoveFile;
