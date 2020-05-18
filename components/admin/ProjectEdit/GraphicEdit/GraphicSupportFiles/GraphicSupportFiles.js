import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Confirm } from 'semantic-ui-react';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import IconPopup from 'components/popups/IconPopup/IconPopup';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import useTimeout from 'lib/hooks/useTimeout';
import { getCount, truncateAndReplaceStr } from 'lib/utils';
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
    } )
      .then( showNotification )
      .then( handleReset )
      .catch( err => console.dir( err ) );
  };

  const handleLanguageChange = async ( e, { id, value } ) => {
    await updateGraphicProject( {
      variables: {
        data: {
          supportFiles: {
            // pull out to builder fn?
            update: {
              data: {
                language: {
                  connect: {
                    id: value,
                  },
                },
              },
              where: {
                id,
              },
            },
          },
        },
        where: {
          id: projectId,
        },
      },
    } )
      .then( showNotification )
      .then( handleReset )
      .catch( err => console.dir( err ) );
  };

  const renderList = () => (
    <ul className="support-files-list">
      { files.map( file => {
        const { id, filename, input, language } = file;
        const _filename = projectId ? filename : input?.name;
        const shortName = _filename?.length > 36
          ? truncateAndReplaceStr( _filename, 24, 12 )
          : _filename;

        return (
          <li key={ id } className={ `support-file-item ${projectId ? 'available' : 'unavailable'}` }>
            <span className="filename">
              { _filename !== shortName
                ? (
                  <Fragment>
                    <button
                      tooltip={ _filename }
                      type="button"
                      aria-hidden="true"
                      className="truncated"
                    >
                      { shortName }
                    </button>
                    <VisuallyHidden el="span">{ _filename }</VisuallyHidden>
                  </Fragment>
                )
                : shortName }
            </span>

            <span className="actions">
              { headline.includes( 'editable' )
                && (
                  <LanguageDropdown
                    id={ id }
                    className="language"
                    value={ language?.id || language }
                    onChange={ handleLanguageChange }
                    disabled={ !projectId }
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
