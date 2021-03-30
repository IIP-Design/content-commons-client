import React, { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import { useRouter } from 'next/router';

import { normalize } from 'lib/graphql/normalizers/graphic';
import { useFileStateManager } from 'lib/hooks/useFileStateManager';
import { serializeFile } from 'lib/utils';

import EditFileGrid from 'components/admin/EditFileGrid/EditFileGrid';
import GraphicStyleDropdown from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import SocialPlatformDropdown from 'components/admin/dropdowns/SocialPlatformDropdown/SocialPlatformDropdown';
import IncludeRequiredFileMsg from 'components/admin/Upload/modals/IncludeRequiredFileMsg/IncludeRequiredFileMsg';

import styles from './GraphicUpload.module.scss';

const GraphicUpload = ( { files, closeModal } ) => {
  const client = useApolloClient();
  const router = useRouter();

  const IMAGE_EXTS = '.png,.jpg,.jpeg,.gif';
  const EDITABLE_EXTS = '.psd,.ai,.ae';
  const OTHER_EXTS = '.pdf,.doc,.docx,.ttf,.otf';

  // What files does this modal accept?
  const ALLOWED_FILES = `${IMAGE_EXTS},${EDITABLE_EXTS},${OTHER_EXTS}`;

  // Defines how may "tabs" appear and which components, e.g dropdowns that they container
  const screens = [
    [
      {
        label: 'Language',
        name: 'language',
        component: LanguageDropdown,
        // What files does this dropdown accept?
        // do NOT include .ttf, .otf files in lang dropdown
        allowedFiles: `${IMAGE_EXTS},.pdf,.doc,.docx,`,
        props: { search: true },
      },
    ],
    [
      {
        label: 'Style',
        name: 'style',
        component: GraphicStyleDropdown,
        allowedFiles: IMAGE_EXTS,
      },
      {
        label: 'Platform',
        name: 'social',
        component: SocialPlatformDropdown,
        allowedFiles: IMAGE_EXTS,
        props: { closeOnChange: true },
      },
    ],
  ];

  // Set state with files normalized for the graphic content type
  const { state, dispatch } = useFileStateManager( null, normalize( files ) );
  const [hasGraphicFiles, setHasGraphicFiles] = useState( false );
  const [showRequiredFilesMsg, setShowRequiredFilesMsg] = useState( false );

  const getGraphicFiles = () => {
    if ( state?.files ) {
      return state.files.filter( file => {
        const { input: { type }, styleSelection } = file;

        const isRequiredFileType = type.includes( 'gif' ) || type.includes( 'jpeg' ) || type.includes( 'png' );
        // Do not allow required file types with 'Clean' style to be added as graphic files
        const isReqdFileWithCleanStyle = isRequiredFileType && styleSelection === 'Clean';

        return isRequiredFileType && !isReqdFileWithCleanStyle;
      } );
    }

    return [];
  };

  useEffect( () => {
    const graphicFiles = getGraphicFiles();
    const count = graphicFiles.length;

    setHasGraphicFiles( !!count );
  }, [state.files] );

  /**
   * Serialize File Objects, write local object to Apollo cache, go to graphic edit page
   */
  const create = async () => {
    // display required files message
    if ( !hasGraphicFiles ) {
      setShowRequiredFilesMsg( true );

      return null;
    }

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
      <p className={ styles.files }>{ `Preparing ${state.files.length} files for upload...` }</p>

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

      <IncludeRequiredFileMsg
        msg="Please include at least one graphic file."
        includeRequiredFileMsg={ showRequiredFilesMsg }
        setIncludeRequiredFileMsg={ setShowRequiredFilesMsg }
      />
    </div>
  );
};

GraphicUpload.propTypes = {
  closeModal: PropTypes.func,
  files: PropTypes.array,
};

export default GraphicUpload;
