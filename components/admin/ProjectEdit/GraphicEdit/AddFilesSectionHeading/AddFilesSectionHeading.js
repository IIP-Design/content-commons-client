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
  } = props;

  return (
    <div className={ `add-files-section-heading ${projectId ? 'display' : 'hidden'}` }>
      <HeadlineElement className="headline uppercase">
        { title }
      </HeadlineElement>

      <ButtonAddFiles
        accept={ acceptedFileTypes }
        onChange={ handleAddFiles }
        multiple
      >
        + Add Files
      </ButtonAddFiles>
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
};

export default AddFilesSectionHeading;
