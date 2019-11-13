import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import './PackageType.scss';

const PackageType = props => {
  const {
    closeModal,
    updateModalClassname,
    accept,
    goNext,
    addPackageFiles,
  } = props;

  const [pkgForm, setPkgFormValues] = useState( { name: '', type: 'Daily Guidance' } );

  useEffect( () => {
    updateModalClassname( 'upload_modal package-type-active' );
    return () => updateModalClassname( 'upload_modal' );
  }, [] );

  const handleOnChangeFiles = files => {
    addPackageFiles( files );
    goNext();
  };

  const handleInputOnChange = e => {
    setPkgFormValues( {
      ...pkgForm,
      [e.target.name]: e.target.value
    } );
  };

  return (
    <Form className="packageType">
      <Form.Input
        label="Name"
        name="name"
        value={ pkgForm.name }
        required
        onChange={ handleInputOnChange }
      />
      <Form.Input
        readOnly
        label="Type"
        name="type"
        value={ pkgForm.type }
        required
        // onChange={ handleInputOnChange } - TODO: Add dropdown for package types
      />
      <div className="upload_actions">
        <Button
          type="button"
          onClick={ closeModal }
          className="secondary alternative"
          content="Cancel"
        />
        <ButtonAddFiles
          disabled={ !pkgForm.name || !pkgForm.type }
          accept={ accept }
          onChange={ e => handleOnChangeFiles( e.target.files ) }
          multiple
        >
          Add Files
        </ButtonAddFiles>
      </div>
    </Form>
  );
};

PackageType.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func,
  goNext: PropTypes.func,
  accept: PropTypes.string,
  addPackageFiles: PropTypes.func,
};

export default PackageType;
