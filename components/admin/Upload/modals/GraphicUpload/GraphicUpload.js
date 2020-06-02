import React from 'react';
// import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { useFileStateManger } from 'lib/hooks/useFileStateManger';
import { normalize } from 'lib/graphql/normalizers/graphic';
import { serializeFile } from 'lib/utils';
import EditFileGrid from './GraphicProjectFiles/EditFileGrid/EditFileGrid';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import GraphicStyleDropdown from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';
import SocialPlatformDropdown from 'components/admin/dropdowns/SocialPlatformDropdown/SocialPlatformDropdown';
import styles from './GraphicUpload.module.scss';

const GraphicUpload = ( { files, closeModal } ) => {
  const client = useApolloClient();
  const router = useRouter();

  // What files does this modal accept?
  const ALLOWED_FILES = '.png,.jpg,.jpeg,.gif,.psd,.ai,.ae,.pdf,.doc,.docx,.ttf';

  // Defines how may "tabs" appear and which components, e.g dropdowns that they container
  const screens = [
    [
      {
        label: 'Language',
        name: 'language',
        component: LanguageDropdown,
        allowedFiles: '.png,.jpg,.jpeg,.gif,.pdf,.doc,.docx,.ttf', // What files does this dropdown accept?
        props: { search: true },
      },
    ],
    [
      {
        label: 'Style',
        name: 'style',
        component: GraphicStyleDropdown,
        allowedFiles: '.png,.jpg,.jpeg,.gif',
      },
      {
        label: 'Platform',
        name: 'social',
        component: SocialPlatformDropdown,
        allowedFiles: '.png,.jpg,.jpeg,.gif',
      },
    ],
  ];

  // Set state with files normalized for the graphic content type
  const { state, dispatch } = useFileStateManger( null, normalize( files ) );

  /**
   * Serialize File Objects, write local object to Apollo cache, go to graphic eit page
   */
  const create = async () => {
    // Loop thru files, serialize File Object and create object
    const fileList = await Promise.all(
      state.files.map( async file => {
        // File Object must be serialized for Apollo cache store
        const dataUrl = await serializeFile( file.input );

        return {
          __typename: 'LocalImageFile',
          ...file,
          input: {
            __typename: 'LocalInputFile',
            dataUrl,
            name: file.input.name,
            size: file.input.size,
          },
        };
      } ),
    ).catch( err => {
      // console.log( `Unable to process files ${err.toString()}` );
    } );

    // If there are images, Write files to apollo cache
    if ( fileList?.length ) {
      client.writeData( {
        data: {
          localGraphicProject: {
            __typename: 'LocalGraphicProject',
            files: fileList,
          },
        },
      } );

      // Go to GraphicEdit page
      router.push( {
        pathname: '/admin/project',
        query: {
          content: 'graphic',
          action: 'edit',
        },
      } );
    }
  };

  return (
    <div className={ styles.container }>
      <h1 style={ { fontSize: '1rem' } }>SOCIAL MEDIA GRAPHIC PROJECT</h1>
      <p className={ styles.files }>{`Preparing ${state.files.length} files for upload...`}</p>

      <EditFileGrid
        files={ state.files }
        screens={ screens }
        allowedFiles={ ALLOWED_FILES }
        duplicateConfirm
        removeConfirm
        cancelConfirm
        showHeader
        showCompletionTracker
        continueBtn="Continue"
        onCancel={ closeModal }
        onContinue={ create }
        onAdd={ _files => dispatch( { type: 'ADD', files: normalize( _files ) } ) }
        onUpdate={ data => dispatch( { type: 'UPDATE', data } ) }
        onRemove={ file => dispatch( { type: 'REMOVE', fileId: file.id } ) }
      />
    </div>
  );
};

GraphicUpload.propTypes = {
  closeModal: PropTypes.func,
  files: PropTypes.array,
};

export default GraphicUpload;
