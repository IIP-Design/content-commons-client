/**
 *
 * EditSingleProjectItem
 *
 */
import React from 'react';
// import PropTypes from 'prop-types';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import VideoEditVideo from 'components/admin/projects/ProjectEdit/VideoEditVideo/VideoEditVideo';
import './EditSingleProjectItem.scss';

class EditSingleProjectItem extends React.PureComponent {
  render() {
    return (
      <ModalItem
        customClassName="edit-project-item"
        headline="The Project Title"
        textDirection="ltr"
      >
        <VideoEditVideo id="cjtg35swx002o0775cqv9vxhs" />
      </ModalItem>
    );
  }
}

EditSingleProjectItem.propTypes = {};

export default EditSingleProjectItem;
