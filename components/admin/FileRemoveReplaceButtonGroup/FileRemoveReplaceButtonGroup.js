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
  const { onReplace, onRemove } = props;

  return (
    <Button.Group basic className="FileRemoveReplaceButtonGroup__btn-group">
      <ButtonAddFiles onChange={ onReplace }>
        <span tooltip="Replace">
          <img src={ replaceIcon } alt="Replace Video File Button" />
        </span>
      </ButtonAddFiles>

      <Button onClick={ onRemove }>
        <span tooltip="Remove">
          <img src={ removeIcon } alt="Remove Video File Button" />
        </span>
      </Button>
    </Button.Group>
  );
};

FileRemoveReplaceButtonGroup.propTypes = {
  onReplace: PropTypes.func,
  onRemove: PropTypes.func
};

export default FileRemoveReplaceButtonGroup;
