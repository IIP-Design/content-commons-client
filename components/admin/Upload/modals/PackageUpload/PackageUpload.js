import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import { Tab } from 'semantic-ui-react';
import DynamicConfirm from 'components/admin/DynamicConfirm/DynamicConfirm';
import PackageType from './PackageType/PackageType';
import PackageFiles from './PackageFiles/PackageFiles';
import './PackageUpload.scss';

const PackageUpload = props => {
  const { closeModal, updateModalClassname } = props;

  const [activeIndex, setActiveIndex] = useState( 0 );
  const [files, setFiles] = useState( [] );
  const [confirm, setConfirm] = useState( {} );

  const goNext = () => {
    setActiveIndex( 1 );
  };

  const closeConfirm = () => {
    setConfirm( { open: false } );
  };

  const addPackageFiles = filesFromInputSelection => {
    const fileList = Array.from( filesFromInputSelection );
    const filesToAdd = fileList.map( file => ( {
      id: v4(),
      input: file,
      text: file.name,
      use: '',
    } ) );
    setFiles( [...filesToAdd] );
  };

  const removePackageFile = id => {
    const file = files.find( f => f.id === id );
    if ( !file ) {
      console.error( 'File not found for removal.' );
    }

    setConfirm( {
      open: true,
      headline: 'Are you sure you want to remove this file?',
      content: `You are about to remove ${file.input.name}. This file will not be uploaded with this project.`,
      cancelButton: 'No, take me back',
      confirmButton: 'Yes, remove',
      onCancel: () => closeConfirm(),
      onConfirm: () => {
        setFiles( prevFiles => prevFiles.filter( f => f.id !== id ) );
        closeConfirm();
      }
    } );
  };

  const updateField = ( e, data ) => {
    setFiles( prevFiles => prevFiles.map( file => {
      if ( file.id !== data.id ) {
        return file;
      }
      return { ...file, use: data.value };
    } ) );
  };

  const accept = '.doc, .docx, .docm, .docb, .dotx, .dotm, .pdf';

  const panes = [
    {
      menuItem: 'Create New Package',
      render: () => (
        <Tab.Pane>
          <PackageType
            closeModal={ closeModal }
            updateModalClassname={ updateModalClassname }
            accept={ accept }
            goNext={ goNext }
            addPackageFiles={ addPackageFiles }
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: '',
      render: () => (
        <Tab.Pane>
          <PackageFiles
            closeModal={ closeModal }
            updateModalClassname={ updateModalClassname }
            accept={ accept }
            files={ files }
            addPackageFiles={ addPackageFiles }
            removePackageFile={ removePackageFile }
            updateField={ updateField }
          />
        </Tab.Pane>
      )
    }
  ];

  return (
    <Fragment>
      <Tab
        activeIndex={ activeIndex }
        panes={ panes }
        className="packageUpload"
      />
      <DynamicConfirm { ...confirm } />
    </Fragment>
  );
};

PackageUpload.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func
};

export default PackageUpload;
