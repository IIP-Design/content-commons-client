import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popup, Button } from 'semantic-ui-react';

import 'styles/tooltip.scss'; // importing here so a rule can be overridden
import './FileRemoveReplaceMenu.scss';

/**
 * Displays replace/remove buttons as a dropdown menu
 * @param {object} props
 */
const FileRemoveReplaceMenu = props => {
  const { disableRemove } = props;
  const [isOpen, setIsOpen] = useState( false );
  const { onRemove } = props;
  const setDuplicateFiles = props.setDuplicateFiles ? props.setDuplicateFiles : null;

  // add debounce is perf degrades
  const onResize = () => {
    if ( isOpen ) {
      setIsOpen( false );
    }
  };

  // menu position becomes incorrect on resize so hide
  useEffect( () => {
    window.addEventListener( 'resize', onResize );
    return () => window.removeEventListener( 'resize', onResize );
  }, [isOpen] );

  const menu = () => (
    <div className="FileRemoveReplaceMenu__wrapper">
      <Button
        className="FileRemoveReplaceMenu__btn-close no-background"
        icon="close"
        onClick={ () => setIsOpen( false ) }
      />

      <Button
        className="FileRemoveReplaceMenu__btn-delete no-background"
        onClick={ onRemove }
        disabled={ disableRemove }
      >Remove File
      </Button>
    </div>
  );

  return (
    <Popup
      className="FileRemoveReplaceMenu"
      trigger={ <Button icon="ellipsis vertical" className="no-background" /> }
      content={ menu }
      open={ isOpen }
      onOpen={ () => {
        if ( setDuplicateFiles ) setDuplicateFiles( [] );
        setIsOpen( true );
      } }
      basic
      on="click"
      position="bottom right"
      horizontalOffset={ 10 }
      verticalOffset={ -56 }
      hideOnScroll
    />
  );
};

FileRemoveReplaceMenu.defaultProps = {
  disableRemove: false
};

FileRemoveReplaceMenu.propTypes = {
  onRemove: PropTypes.func,
  setDuplicateFiles: PropTypes.func,
  disableRemove: PropTypes.bool
};

export default FileRemoveReplaceMenu;
