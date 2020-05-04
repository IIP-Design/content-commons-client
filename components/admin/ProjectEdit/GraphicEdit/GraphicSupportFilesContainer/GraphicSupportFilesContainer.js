import React from 'react';
import PropTypes from 'prop-types';
import AddFilesSectionHeading from 'components/admin/ProjectEdit/GraphicEdit/AddFilesSectionHeading/AddFilesSectionHeading';
import GraphicSupportFiles from 'components/admin/ProjectSupportFiles/GraphicSupportFiles/GraphicSupportFiles';
import './GraphicSupportFilesContainer.scss';

const GraphicSupportFilesContainer = props => {
  const {
    projectId,
    handleAddFiles,
    updateNotification,
    fileTypes
  } = props;

  return (
    <div className="support-files-container graphic-project">
      <AddFilesSectionHeading
        projectId={ projectId }
        title="Support Files"
        acceptedFileTypes="image/*, font/*, application/postscript, application/pdf, application/rtf, text/plain, .docx, .doc"
        handleAddFiles={ handleAddFiles }
      />

      <div className="container">
        { fileTypes.map( ( fileType, i ) => {
          const { files, headline, helperText } = fileType;

          return (
            <React.Fragment key={ `${projectId}-${headline}` }>
              <GraphicSupportFiles
                projectId={ projectId }
                headline={ headline }
                helperText={ helperText }
                files={ files }
                updateNotification={ updateNotification }
              />

              { i !== fileTypes.length - 1 && <div className="separator" /> }
            </React.Fragment>
          );
        } ) }
      </div>
    </div>
  );
};

GraphicSupportFilesContainer.propTypes = {
  projectId: PropTypes.string,
  handleAddFiles: PropTypes.func,
  updateNotification: PropTypes.func,
  fileTypes: PropTypes.array
};

export default GraphicSupportFilesContainer;
