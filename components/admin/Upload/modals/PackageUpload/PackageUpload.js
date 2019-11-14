import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import { Tab } from 'semantic-ui-react';
import { removeDuplicatesFromArray } from 'lib/utils';
import DynamicConfirm from 'components/admin/DynamicConfirm/DynamicConfirm';
import PackageType from './PackageType/PackageType';
import PackageFiles from './PackageFiles/PackageFiles';
import './PackageUpload.scss';

export const PackageUploadContext = React.createContext();

const PackageUpload = props => {
  const { closeModal, updateModalClassname } = props;

  const [activeIndex, setActiveIndex] = useState( 0 );
  const [files, setFiles] = useState( [] );
  const [confirm, setConfirm] = useState( {} );
  const [allFieldsSelected, setAllFieldsSelected] = useState( false );

  useEffect( () => {
    const complete = files.every( file => file.use );
    setAllFieldsSelected( complete );
  }, [files] );

  const goNext = () => {
    setActiveIndex( 1 );
  };

  const closeConfirm = () => {
    setConfirm( { open: false } );
  };

  const compareFilenames = ( a, b ) => a.input.name.localeCompare( b.input.name );

  const processDuplicates = filesToAdd => {
    try {
      const { duplicates, uniq } = removeDuplicatesFromArray( [...files, ...filesToAdd], 'input.name' );

      // if duplicates are present, ask user if they are indeed duplicates
      if ( duplicates ) {
        const dups = duplicates.reduce( ( acc, cur ) => `${acc} ${cur.input.name}\n`, '' );
        setConfirm( {
          open: true,
          headline: 'It appears that duplicate files are being added.',
          content: `Do you want to add these files?\n${dups}`,
          cancelButton: 'No, do not add files',
          confirmButton: 'Yes, add files',
          onCancel: () => {
            setFiles( uniq.sort( compareFilenames ) );
            closeConfirm();
          },
          onConfirm: () => {
            setFiles( [...filesToAdd, ...files].sort( compareFilenames ) );
            closeConfirm();
          }
        } );
      } else {
        setFiles( [...filesToAdd, ...files].sort( compareFilenames ) );
      }
    } catch ( err ) {
      console.error( err );
    }
  };

  const addPackageFiles = filesFromInputSelection => {
    const fileList = Array.from( filesFromInputSelection );
    const filesToAdd = fileList.map( file => ( {
      id: v4(),
      input: file,
      text: file.name,
      use: '',
    } ) );
    // Only check for duplicates if there are current files to compare against
    if ( files.length ) {
      processDuplicates( filesToAdd );
    } else {
      setFiles( filesToAdd.sort( compareFilenames ) );
    }
  };

  const removePackageFile = id => {
    const file = files.find( f => f.id === id );
    if ( !file ) {
      console.error( 'File not found for removal.' );
    }

    setConfirm( {
      open: true,
      headline: 'Are you sure you want to remove this file?',
      content: `You are about to remove ${file.input.name}. This file will not be uploaded with this package.`,
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
          <PackageUploadContext.Provider value={ {
            files,
            addPackageFiles,
            removePackageFile,
            accept,
            updateField,
            closeModal,
            updateModalClassname,
            allFieldsSelected,
          } }
          >
            <PackageFiles />
          </PackageUploadContext.Provider>
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
