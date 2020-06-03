import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm, Modal } from 'semantic-ui-react';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import './ActionButtons.scss';

const ActionButtons = props => {
  const {
    type,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    previewNode,
    disabled,
    handle,
    show,
    loading,
  } = props;

  const isPackage = type.toLowerCase() === 'package';
  const contentType = isPackage ? type : 'project';

  return (
    <Fragment>
      { show.delete && (
        <Fragment>
          <Button
            className="action-btn btn--delete"
            content={ `Delete ${type === 'package' ? 'Package' : 'Project'}` }
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
                  This
                  {' '}
                  { contentType }
                  {' '}
                  will be removed permanently from the Content Cloud. Any files
                  uploaded in this
                  {' '}
                  { contentType }
                  {' '}
                  will also be removed permanently.
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

      { show.preview && (
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
  type: 'project',
  deleteConfirmOpen: false,
  setDeleteConfirmOpen: () => {},
  disabled: {},
  handle: {},
  show: {},
};

ActionButtons.propTypes = {
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
