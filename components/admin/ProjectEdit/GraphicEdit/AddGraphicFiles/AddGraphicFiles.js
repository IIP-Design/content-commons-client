import React from 'react';
import PropTypes from 'prop-types';
import { useFileStateManager } from 'lib/hooks/useFileStateManager';
import { normalize } from 'lib/graphql/normalizers/graphic';
import EditFileGrid from 'components/admin/EditFileGrid/EditFileGrid';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import GraphicStyleDropdown from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';
import SocialPlatformDropdown from 'components/admin/dropdowns/SocialPlatformDropdown/SocialPlatformDropdown';
import styles from './AddGraphicFiles.module.scss';

const AddGraphicFiles = ( { files, closeModal, save } ) => {
  // What files does this modal accept?
  const ALLOWED_FILES = '.png,.jpg,.jpeg,.gif';

  // Defines how may "tabs" appear and which components, e.g dropdowns that they container
  const screens = [
    [
      {
        label: 'Language',
        name: 'language',
        component: LanguageDropdown,
        props: { search: true },
        allowedFiles: ALLOWED_FILES,
      },
    ],
    [
      {
        label: 'Style',
        name: 'style',
        component: GraphicStyleDropdown,
        allowedFiles: ALLOWED_FILES,
      },
      {
        label: 'Platform',
        name: 'social',
        component: SocialPlatformDropdown,
        allowedFiles: ALLOWED_FILES,
        props: { closeOnChange: true },
      },
    ],
  ];

  // Set state with files normalized for the graphic content type
  const { state, dispatch } = useFileStateManager( null, normalize( files ) );

  return (
    <div className={ styles.container }>
      <h1 style={ { fontSize: '1rem' } }>SOCIAL MEDIA GRAPHIC PROJECT</h1>
      <p className={ styles.files }>{`Adding ${state.files.length} files.`}</p>

      <EditFileGrid
        files={ state.files }
        screens={ screens }
        allowedFiles={ ALLOWED_FILES }
        duplicateConfirm
        removeConfirm
        cancelConfirm
        showHeader
        showCompletionTracker
        continueBtn="Save"
        onCancel={ closeModal }
        onContinue={ () => save( state.files ) }
        onAdd={ _files => dispatch( { type: 'ADD', files: normalize( _files ) } ) }
        onUpdate={ data => dispatch( { type: 'UPDATE', data } ) }
        onRemove={ file => dispatch( { type: 'REMOVE', fileId: file.id } ) }
      />
    </div>
  );
};

AddGraphicFiles.propTypes = {
  closeModal: PropTypes.func,
  save: PropTypes.func,
  files: PropTypes.array,
};

export default AddGraphicFiles;
