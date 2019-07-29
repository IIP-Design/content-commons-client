import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import './IncludeVideoFileMsg.scss';

const IncludeVideoFileMsg = props => {
  const { includeVideoFileMsg, setIncludeVideoFileMsg } = props;
  return (
    <Modal
      className="includeVideoFileMsg"
      content="Please include at least one video file."
      actions={ ['Close'] }
      open={ includeVideoFileMsg }
      closeOnDimmerClick={ false }
      onClose={ () => setIncludeVideoFileMsg( false ) }
      size="mini"
    />
  );
};

IncludeVideoFileMsg.propTypes = {
  includeVideoFileMsg: PropTypes.bool,
  setIncludeVideoFileMsg: PropTypes.func
};

export default IncludeVideoFileMsg;
