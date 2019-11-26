import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const ButtonAddFiles = props => {
  const {
    onChange, disabled, className, children, accept, multiple, fluid
  } = props;
  const fileInput = React.createRef();

  // Trigger files dialogue on button click
  const handleOnClick = () => {
    fileInput.current.click();
  };

  // Since using onchange event, need to reset value on input so user can upload same file
  // ie: remove file then upload file again
  const reset = () => {
    fileInput.current.value = null;
  };

  const handleOnChange = e => {
    onChange( e );
    reset();
  };

  return (
    <Fragment>
      <Button
        disabled={ disabled }
        as="button"
        type="button"
        onClick={ handleOnClick }
        className={ className || 'primary' }
        fluid={ fluid }
      >{ children }
      </Button>
      { /* Hidden files dialogue box */ }
      <input
        ref={ fileInput }
        type="file"
        accept={ accept || '*' }
        multiple={ multiple }
        onChange={ handleOnChange }
        className="visibly-hidden"
        tabIndex={ -1 }
      />
    </Fragment>
  );
};

ButtonAddFiles.defaultProps = {
  disabled: false,
  fluid: false
};

ButtonAddFiles.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  fluid: PropTypes.bool
};

export default ButtonAddFiles;
