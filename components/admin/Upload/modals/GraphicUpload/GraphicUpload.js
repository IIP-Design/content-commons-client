import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const GraphicUpload = ( { closeModal } ) => (
  <div style={ { height: '200px', width: '300px' } }>
    <p>Under development</p>
    <Button onClick={ closeModal }>  Cancel </Button>
  </div>
);

GraphicUpload.propTypes = {
  closeModal: PropTypes.func
};

export default GraphicUpload;

