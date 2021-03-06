import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm, Modal } from 'semantic-ui-react';

import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import ButtonLink from 'components/admin/ButtonLink/ButtonLink';

import './ActionButtons.scss';

const ActionButtons = ( {
  id,
  type,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  previewNode,
  disabled,
  handle,
  show,
  loading,
} ) => {
  let contentType;

  switch ( type.toLowerCase() ) {
    case 'package':
      contentType = 'package';
      break;
    case 'playbook':
      contentType = 'playbook';
      break;
    case 'toolkit':
      contentType = 'toolkit';
      break;
    default:
      contentType = 'project';
  }

  const capitalizeFirst = string => `${string.charAt( 0 ).toUpperCase()}${string.slice( 1 )}`;

  return (
    <Fragment>
      { show.delete && (
        <Fragment>
          <Button
            className="action-btn btn--delete"
            content={ `Delete ${capitalizeFirst( contentType )}` }
            basic
            onClick={ () => setDeleteConfirmOpen( true ) }
            disabled={ disabled.delete }
          />

          <Confirm
            className="delete"
            open={ deleteConfirmOpen }
            content={ (
              <ConfirmModalContent
                className={ `delete_confirm delete_confirm--${contentType}` }
                headline={ `Are you sure you want to delete this ${contentType}?` }
              >
                <p>
                  { `This ${contentType} will be removed permanently from the Content Commons. Any files uploaded in this ${contentType} will also be removed permanently.` }
                </p>
              </ConfirmModalContent>
            ) }
            onCancel={ () => setDeleteConfirmOpen( false ) }
            onConfirm={ handle.deleteConfirm }
            cancelButton="No, take me back"
            confirmButton="Yes, delete forever"
          />
        </Fragment>
      ) }

      { show.save && (
        <Button
          className="action-btn btn--save-draft"
          content="Save & Exit"
          basic
          onClick={ handle.save }
          disabled={ disabled.save }
        />
      ) }

      { show.preview && type.toLowerCase() !== 'playbook'
        && (
          <Modal
            trigger={ (
              <Button
                className="action-btn btn--preview"
                content="Preview"
                primary
                disabled={ disabled.preview }
              />
            ) }
            closeIcon
          >
            <Modal.Content>{ previewNode }</Modal.Content>
          </Modal>
        ) }

      { show.preview && type.toLowerCase() === 'playbook'
        && (
          <ButtonLink
            content="Preview"
            disabled={ disabled.preview }
            url={ `/admin/package/playbook/preview/${id}` }
          />
        ) }

      { show.publishChanges && (
        <Button
          className={ `action-btn btn--publish-changes ${loading.publishChanges ? 'loading' : ''}` }
          content="Publish Changes"
          basic
          onClick={ handle.publishChanges }
          disabled={ disabled.publishChanges }
        />
      ) }

      { show.publish && (
        <Button
          className={ `action-btn btn--publish ${loading.publish ? 'loading' : ''}` }
          content="Publish"
          onClick={ handle.publish }
          disabled={ disabled.publish }
        />
      ) }

      { show.unpublish && (
        <Button
          className={ `action-btn btn--publish ${loading.unpublish ? 'loading' : ''}` }
          content="Unpublish"
          onClick={ handle.unpublish }
          disabled={ disabled.unpublish }
        />
      ) }

      { show.review && (
        <Button
          className="action-btn btn--final-review"
          content="Final Review"
          onClick={ handle.review }
          disabled={ disabled.review }
        />
      ) }
    </Fragment>
  );
};

ActionButtons.defaultProps = {
  id: '',
  type: 'project',
  deleteConfirmOpen: false,
  setDeleteConfirmOpen: () => {},
  disabled: {},
  handle: {},
  show: {},
};

ActionButtons.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  deleteConfirmOpen: PropTypes.bool,
  setDeleteConfirmOpen: PropTypes.func,
  previewNode: PropTypes.node,
  disabled: PropTypes.object,
  handle: PropTypes.object,
  show: PropTypes.object,
  loading: PropTypes.object,
};

export default ActionButtons;
