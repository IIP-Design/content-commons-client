/**
 *
 * withModal
 *
 */

import React from 'react';
import { object } from 'prop-types';

import { Modal } from 'semantic-ui-react';

const withModal = ( props, Trigger, Content, options ) => {
  const { triggerProps, contentProps } = props;
  return (
    <Modal
      { ...options }
      trigger={ <Trigger { ...triggerProps } /> }
    >
      <Modal.Content>
        <Content { ...contentProps } />
      </Modal.Content>
    </Modal>
  );
};

withModal.propTypes = {
  triggerProps: object,
  contentProps: object,
  options: object
};

export default withModal;
