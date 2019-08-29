import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const ButtonAddFiles = props => {
  const fileInput = React.createRef();

  // Trigger files dialogue on button click
  const handleOnClick = () => {
    fileInput.current.click();
  };

  return (
    <Fragment>
      <Button
        disabled={ props.disabled }
        as="button"
        type="button"
        onClick={ handleOnClick }
        className={ props.className || 'primary' }
      >{ props.children }
      </Button>
      { /* Hidden files dialogue box */ }
      <input
        id={ props.inputID || 'uploadFileInput' }
        ref={ fileInput }
        type="file"
        accept={ props.accept || '*' }
        multiple={ props.multiple }
        onChange={ props.onChange }
        className="visibly-hidden"
        tabIndex={ -1 }
      />
    </Fragment>
  );
};

ButtonAddFiles.defaultProps = {
  disabled: false
};

ButtonAddFiles.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  inputID: PropTypes.string
};

export default ButtonAddFiles;
