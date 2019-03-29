import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import replaceIcon from 'static/icons/icon_replace.svg';
import removeIcon from 'static/icons/icon_remove.svg';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import 'styles/tooltip.scss'; // importing here so a rule can be overridden
import './ActionsMenuFileUpload.scss';


const ActionsMenuFileUpload = props => {
  const handleOnRemove = () => {
    props.onRemove( props.id );
  };

  const handleOnReplace = e => {
    props.onReplace( props.id, e.target.files[0] );
  };

  return (
    <Button.Group basic className="file-upload__btn-group">
      <ButtonAddFiles onChange={ handleOnReplace }>
        <span tooltip="Replace">
          <img src={ replaceIcon } alt="Replace Video File Button" />
        </span>
      </ButtonAddFiles>

      <Button onClick={ handleOnRemove }>
        <span tooltip="Remove">
          <img src={ removeIcon } alt="Remove Video File Button" />
        </span>
      </Button>
    </Button.Group>
  );
};

ActionsMenuFileUpload.propTypes = {
  id: PropTypes.string,
  onReplace: PropTypes.func,
  onRemove: PropTypes.func
};

export default ActionsMenuFileUpload;
