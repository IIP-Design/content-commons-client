import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

import './IncludeRequiredFileMsg.scss';

const IncludeRequiredFileMsg = ( {
  msg,
  includeRequiredFileMsg,
  setIncludeRequiredFileMsg,
} ) => (
  <Modal
    className="includeRequiredFileMsg"
    content={ msg }
    actions={ ['Close'] }
    open={ includeRequiredFileMsg }
    closeOnDimmerClick={ false }
    onClose={ () => setIncludeRequiredFileMsg( false ) }
    size="mini"
  />
);

IncludeRequiredFileMsg.propTypes = {
  msg: PropTypes.string,
  includeRequiredFileMsg: PropTypes.bool,
  setIncludeRequiredFileMsg: PropTypes.func,
};

export default IncludeRequiredFileMsg;
