import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Confirm } from 'semantic-ui-react';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import IconPopup from 'components/popups/IconPopup/IconPopup';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import { UPDATE_SUPPORT_FILE_MUTATION, DELETE_SUPPORT_FILE_MUTATION } from 'lib/graphql/queries/common';
import { GRAPHIC_PROJECT_QUERY } from 'lib/graphql/queries/graphic';
import { getCount } from 'lib/utils';
import './GraphicProjectSupportFiles.scss';

const GraphicProjectSupportFiles = props => {
  const {
    projectId, headline, helperText, files
  } = props;
  const [fileIdToDelete, setFileIdToDelete] = useState( '' );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [deleteSupportFile] = useMutation( DELETE_SUPPORT_FILE_MUTATION );
  const [updateSupportFile] = useMutation( UPDATE_SUPPORT_FILE_MUTATION );

  const handleResetAfterDelete = () => {
    setDeleteConfirmOpen( false );
    setFileIdToDelete( '' );
  };

  const handleDelete = async id => {
    await deleteSupportFile( {
      variables: { id },
      refetchQueries: [
        {
          query: GRAPHIC_PROJECT_QUERY,
          variables: { id: projectId }
        }
      ]
    } )
      .then( handleResetAfterDelete )
      .catch( err => console.dir( err ) );
  };

  const handleLanguageChange = async ( e, { id, value } ) => {
    await updateSupportFile( {
      variables: {
        data: {
          language: {
            connect: {
              id: value
            }
          }
        },
        where: {
          id
        }
      }
    } ).catch( err => console.dir( err ) );
  };

  const renderList = () => (
    <ul className="support-files-list">
      { files.map( file => {
        const { id, filename } = file;

        return (
          <li key={ id } className="support-file-item">
            <span className="filename">{ filename }</span>

            <span className="actions">
              { headline.includes( 'editable' )
                && (
                  <LanguageDropdown
                    id={ id }
                    className="language"
                    value={ file.language.id }
                    onChange={ handleLanguageChange }
                    required
                  />
                ) }

              <FileRemoveReplaceButtonGroup
                onRemove={ () => {
                  setDeleteConfirmOpen( true );
                  setFileIdToDelete( id );
                } }
              />
            </span>
          </li>
        );
      } ) }
    </ul>
  );

  return (
    <div className={ `graphic-project-support-files ${headline.replace( ' ', '-' )}` }>
      <div className="list-heading">
        <h3 className="title">{ headline }</h3>
        <IconPopup
          message={ helperText }
          iconSize="small"
          iconType="info circle"
          popupSize="mini"
        />
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
        onCancel={ handleResetAfterDelete }
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

GraphicProjectSupportFiles.propTypes = {
  projectId: PropTypes.string,
  headline: PropTypes.string,
  helperText: PropTypes.string,
  files: PropTypes.array
};

export default GraphicProjectSupportFiles;
