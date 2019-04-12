import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Label, Icon } from 'semantic-ui-react';

/**
 * Tracks number of fields that need to be completed
 * Props:
 * fields: Fields to track completion
 * display: Should completion tracker be shown in parent component
 *
 * @param {object } props
 *
 */
const UploadCompletionTracker = props => {
  const { fields, display } = props;
  const [fieldsToComplete, setFieldsToComplete] = useState( fields.length );

  // fields are properties of a file object that is stored in main files state array
  // in the VideoUpload component so when another component changes the field,
  // it will be reflected here. Field completion is marked when a field has a
  // valid value
  useEffect( () => {
    const toComplete = fields.filter( field => !field );
    setFieldsToComplete( toComplete.length );
  }, [fields] );


  // following styles used to display either completion OR number of fields to complete
  const show = {
    display: 'inline-block'
  };

  const hide = {
    display: 'none'
  };

  return (
    <span className={ `item-complete ${display}` }>
      <Label style={ fieldsToComplete ? show : hide } circular size="mini" color="red">{ fieldsToComplete }</Label>
      <Icon style={ fieldsToComplete ? hide : show } circular size="small" inverted color="green" name="check" />
    </span>
  );
};

UploadCompletionTracker.defaultProps = {
  display: 'show'
};

UploadCompletionTracker.propTypes = {
  fields: PropTypes.array,
  display: PropTypes.string
};

export default UploadCompletionTracker;
