import React from 'react';
import PropTypes from 'prop-types';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import './AddFilesSectionHeading.scss';

const AddFilesSectionHeading = props => {
  const {
    projectId,
    el: HeadlineElement,
    title,
    acceptedFileTypes,
    handleAddFiles,
    children,
  } = props;

  return (
    <div className={ `add-files-section-heading ${projectId ? 'available' : 'unavailable'}` }>
      <HeadlineElement className="headline uppercase">{title}</HeadlineElement>

      { children || (
        <ButtonAddFiles
          accept={ acceptedFileTypes }
          onChange={ handleAddFiles }
          multiple
        >
          + Add Files
        </ButtonAddFiles>
      )}
    </div>
  );
};

AddFilesSectionHeading.defaultProps = {
  el: 'h2',
};

AddFilesSectionHeading.propTypes = {
  projectId: PropTypes.string,
  el: PropTypes.string,
  title: PropTypes.string,
  acceptedFileTypes: PropTypes.string,
  handleAddFiles: PropTypes.func,
  children: PropTypes.node,
};

export default AddFilesSectionHeading;
