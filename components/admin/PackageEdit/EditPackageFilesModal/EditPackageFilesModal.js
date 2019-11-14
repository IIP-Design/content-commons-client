import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import { getFileNameNoExt } from 'lib/utils';
import UseDropdown from 'components/admin/dropdowns/UseDropdown/UseDropdown';

const EditPackageFilesModal = props => {
  const { files } = props;
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
      className="edit-package-files"
      size="small"
      // closeOnDimmerClick={ !saving }
      trigger={ <Button className="btn--edit" onClick={ openModal } size="small" basic>Edit</Button> }
    >
      <Modal.Content>
        { /* temporary */ }
        { files.map( file => {
          const { filename, id, use } = file;
          const fileNameNoExt = getFileNameNoExt( filename );
          return (
            <div key={ id }>
              <p>{ filename }</p>
              <Form.Input label="Title" onChange={ () => {} } value={ fileNameNoExt || filename } fluid />
              <UseDropdown id={ id } label="Release Type" onChange={ () => {} } type="document" value={ use.id } required />
            </div>
          );
        } ) }
      </Modal.Content>
    </Modal>
  );
};

EditPackageFilesModal.propTypes = {
  files: PropTypes.array
};

export default EditPackageFilesModal;
