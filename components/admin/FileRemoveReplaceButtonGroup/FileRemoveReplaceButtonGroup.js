import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import removeIcon from 'static/icons/icon_remove.svg';
import trashIcon from 'static/icons/icon_trash.svg';
import 'styles/tooltip.scss'; // importing here so a rule can be overridden
import './FileRemoveReplaceButtonGroup.scss';

/**
 * Displays replace/remove buttons as inline icons
 * @param {object} props
 */
const FileRemoveReplaceButtonGroup = props => {
  const { onRemove, disableRemove, icon } = props;

  return (
    <Button.Group basic className="FileRemoveReplaceButtonGroup__btn-group">
      <Button onClick={ onRemove } disabled={ disableRemove }>
        <span tooltip="Remove">
          <img src={ icon === 'trash' ? trashIcon : removeIcon } alt="Remove File Button" />
        </span>
      </Button>
    </Button.Group>
  );
};

FileRemoveReplaceButtonGroup.defaultProps = {
  disableRemove: false,
  icon: '',
};

FileRemoveReplaceButtonGroup.propTypes = {
  onRemove: PropTypes.func,
  disableRemove: PropTypes.bool,
  icon: PropTypes.string,
};

export default FileRemoveReplaceButtonGroup;
