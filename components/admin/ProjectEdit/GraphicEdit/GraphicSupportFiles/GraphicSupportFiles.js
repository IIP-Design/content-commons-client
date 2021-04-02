import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Confirm } from 'semantic-ui-react';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import IconPopup from 'components/popups/IconPopup/IconPopup';
import Filename from 'components/admin/Filename/Filename';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import { GRAPHIC_PROJECT_QUERY, UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import useTimeout from 'lib/hooks/useTimeout';
import { getCount } from 'lib/utils';
import './GraphicSupportFiles.scss';

const GraphicSupportFiles = props => {
  const {
    projectId, headline, helperText, files, updateNotification,
  } = props;
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

  const renderList = () => (
    <ul className="support-files-list">
      { files.map( file => {
        const { id, filename, input } = file;
        const _filename = projectId ? filename : input?.name;

        return (
          <li key={ id } className={ `support-file-item ${projectId ? 'available' : 'unavailable'}` }>
            <span className="filename">
              <Filename
                children={ _filename }
                filenameLength={ 48 }
                numCharsBeforeBreak={ 20 }
                numCharsAfterBreak={ 28 }
              />
            </span>

            <FileRemoveReplaceButtonGroup
              onRemove={ () => {
                setDeleteConfirmOpen( true );
                setFileIdToDelete( id );
              } }
            />
          </li>
        );
      } ) }
    </ul>
  );

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
        ? renderList()
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
