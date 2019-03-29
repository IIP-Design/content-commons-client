import React from 'react';
import PropTypes from 'prop-types';
import { Label, Icon } from 'semantic-ui-react';

const UploadCompletionTracker = props => {
  const { numToComplete, display } = props;

  const show = {
    display: 'inline-block'
  };

  const hide = {
    display: 'none'
  };


  return (
    <span className={ `item-complete ${display}` }>
      <Label style={ numToComplete ? show : hide } circular size="mini" color="red">{ numToComplete }</Label>
      <Icon style={ numToComplete ? hide : show } circular size="small" inverted color="green" name="check" />
    </span>
  );
};

UploadCompletionTracker.propTypes = {
  numToComplete: PropTypes.number,
  display: PropTypes.string
};

export default UploadCompletionTracker;
