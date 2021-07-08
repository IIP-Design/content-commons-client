import { Fragment } from 'react';
import PropTypes from 'prop-types';

import GraphicSupportFiles from 'components/admin/ProjectEdit/GraphicEdit/GraphicSupportFiles/GraphicSupportFiles';

import './SupportFiles.scss';

const SupportFiles = ( { projectId, updateNotification, fileTypes } ) => (
  <div className="support-files-container">
    { fileTypes.map( ( fileType, i ) => {
      const { files, headline, helperText } = fileType;

      return (
        <Fragment key={ `${projectId}-${headline}` }>
          <GraphicSupportFiles
            projectId={ projectId }
            headline={ headline }
            helperText={ helperText }
            files={ files }
            updateNotification={ updateNotification }
          />

          { i !== fileTypes.length - 1 && <div className="separator" /> }
        </Fragment>
      );
    } ) }
  </div>
);

SupportFiles.propTypes = {
  projectId: PropTypes.string,
  updateNotification: PropTypes.func,
  fileTypes: PropTypes.array,
};

export default SupportFiles;
