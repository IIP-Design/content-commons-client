import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import './IncludeRequiredFileMsg.scss';

const IncludeRequiredFileMsg = ( {
  includeRequiredFileMsg,
  setIncludeRequiredFileMsg,
} ) => (
  <Modal
    className="includeRequiredFileMsg"
    content="Please include at least one video file."
    actions={ ['Close'] }
    open={ includeRequiredFileMsg }
    closeOnDimmerClick={ false }
    onClose={ () => setIncludeRequiredFileMsg( false ) }
    size="mini"
  />
);

IncludeRequiredFileMsg.propTypes = {
  includeRequiredFileMsg: PropTypes.bool,
  setIncludeRequiredFileMsg: PropTypes.func,
};

export default IncludeRequiredFileMsg;
