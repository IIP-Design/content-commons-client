import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';

const CancelUpload = props => {
  const [modalOpen, setModalOpen] = useState( false );

  return (
    <Modal
      className="cancelModal"
      open={ modalOpen }
      trigger={ (
        <Button
          content="Cancel"
          className="upload_button upload_button--cancelText"
          onClick={ () => setModalOpen( true ) }
        />
  ) }
    >
      <Modal.Content>
        <h3>Are you sure you want to cancel uploading these files?</h3>
        <p>By cancelling, your files will not be uploaded to Content Commons.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          className="secondary"
          content="No, take me back!"
          onClick={ () => setModalOpen( false ) }
        />
        <Button
          className="upload_button upload_button--cancelGoBack"
          content="Yes, cancel upload"
          onClick={ props.closeModal }
        />
      </Modal.Actions>
    </Modal>
  );
};

CancelUpload.propTypes = {
  closeModal: PropTypes.func
};

export default CancelUpload;
