import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import replaceIcon from 'static/icons/icon_replace.svg';
import removeIcon from 'static/icons/icon_remove.svg';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import 'styles/tooltip.scss'; // importing here so a rule can be overridden
import './FileRemoveReplaceButtonGroup.scss';

/**
 * Displays replace/remove buttons as inline icons
 * @param {object} props
 */
const FileRemoveReplaceButtonGroup = props => {
  const {
    onReplace, onRemove, accept, disableReplace, disableRemove
  } = props;

  return (
    <Button.Group basic className="FileRemoveReplaceButtonGroup__btn-group">
      <ButtonAddFiles onChange={ onReplace } accept={ accept } disabled={ disableReplace }>
        <span tooltip="Replace">
          <img src={ replaceIcon } alt="Replace Video File Button" />
        </span>
      </ButtonAddFiles>

      <Button onClick={ onRemove } disabled={ disableRemove }>
        <span tooltip="Remove">
          <img src={ removeIcon } alt="Remove Video File Button" />
        </span>
      </Button>
    </Button.Group>
  );
};

FileRemoveReplaceButtonGroup.defaultProps = {
  disableReplace: false,
  disableRemove: false
};

FileRemoveReplaceButtonGroup.propTypes = {
  onReplace: PropTypes.func,
  onRemove: PropTypes.func,
  accept: PropTypes.string,
  disableReplace: PropTypes.bool,
  disableRemove: PropTypes.bool
};

export default FileRemoveReplaceButtonGroup;
