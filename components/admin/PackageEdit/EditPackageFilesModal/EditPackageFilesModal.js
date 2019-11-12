import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';

const EditPackageFilesModal = () => {
  const [open, setOpen] = useState( false );

  const closeModal = () => {
    setOpen( false );
  };

  const openModal = () => {
    setOpen( true );
  };

  return (
    <Modal
      open={ open }
      onClose={ closeModal }
      className="edit-support-files"
      size="small"
      // closeOnDimmerClick={ !saving }
      trigger={ <Button className="btn--edit" onClick={ openModal } size="small" basic>Edit</Button> }
    >
      <Modal.Content>
        <p>some modal content</p>
      </Modal.Content>
    </Modal>
  );
};

export default EditPackageFilesModal;
