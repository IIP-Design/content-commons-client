/**
 *
 * EditSingleProjectItem
 *
 */
import React from 'react';
// import PropTypes from 'prop-types';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import './EditSingleProjectItem.scss';

/* eslint-disable react/prefer-stateless-function */
class EditSingleProjectItem extends React.PureComponent {
  render() {
    return (
      <ModalItem
        customClassName="edit-project-item"
        headline="The Project Title"
        textDirection="ltr"
      >
        <p>Edit Single Project Item Component</p>
      </ModalItem>
    );
  }
}

EditSingleProjectItem.propTypes = {};

export default EditSingleProjectItem;
