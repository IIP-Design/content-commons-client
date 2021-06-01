import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Confirm } from 'semantic-ui-react';

import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import IconPopup from 'components/popups/IconPopup/IconPopup';
import FileList from 'components/admin/FileList/FileList';

import { GRAPHIC_PROJECT_QUERY, UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import useTimeout from 'lib/hooks/useTimeout';
import { getCount } from 'lib/utils';

import './GraphicSupportFiles.scss';

const GraphicSupportFiles = ( { projectId, headline, helperText, files, updateNotification } ) => {
  const [fileIdToDelete, setFileIdToDelete] = useState( '' );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );

  const showNotification = () => updateNotification( 'Changes saved' );
  const hideNotification = () => updateNotification( '' );
  const { startTimeout } = useTimeout( hideNotification, 2000 );

  const handleReset = () => {
    setDeleteConfirmOpen( false );
    setFileIdToDelete( '' );
    startTimeout();
  };

  const handleDelete = async id => {
    await updateGraphicProject( {
      variables: {
        data: {
          type: 'SOCIAL_MEDIA',
          supportFiles: {
            'delete': {
              id,
            },
          },
        },
        where: {
          id: projectId,
        },
      },
      update: client => {
        const { graphicProject } = client.readQuery( {
          query: GRAPHIC_PROJECT_QUERY,
          variables: { id: projectId },
        } );

        const supportFiles = graphicProject?.supportFiles?.filter( file => file.id !== id );
        const _graphicProject = { ...graphicProject, supportFiles };

        client.writeQuery( {
          query: GRAPHIC_PROJECT_QUERY,
          data: { graphicProject: _graphicProject },
        } );
      },
    } )
      .then( showNotification )
      .then( handleReset )
      .catch( err => console.dir( err ) );
  };

  const onRemove = id => {
    setDeleteConfirmOpen( true );
    setFileIdToDelete( id );
  };

  return (
    <div className={ `graphic-project-support-files ${headline.replace( ' ', '-' )}` }>
      <div className="list-heading">
        <h3 className="title">{ headline }</h3>
        { projectId
          && (
            <IconPopup
              message={ helperText }
              iconSize="small"
              iconType="info circle"
              popupSize="mini"
            />
          ) }
      </div>

      <Confirm
        className="delete"
        open={ deleteConfirmOpen }
        content={ (
          <ConfirmModalContent
            className="delete_confirm"
            headline="Are you sure you want to delete this file?"
          />
        ) }
        onCancel={ handleReset }
        onConfirm={ () => handleDelete( fileIdToDelete ) }
        cancelButton="No, take me back"
        confirmButton="Yes, delete forever"
      />

      { getCount( files )
        ? <FileList files={ files } onRemove={ onRemove } projectId={ projectId } />
        : <p className="no-files">No files to upload</p> }
    </div>
  );
};

GraphicSupportFiles.propTypes = {
  projectId: PropTypes.string,
  headline: PropTypes.string,
  helperText: PropTypes.string,
  files: PropTypes.array,
  updateNotification: PropTypes.func,
};

export default GraphicSupportFiles;
