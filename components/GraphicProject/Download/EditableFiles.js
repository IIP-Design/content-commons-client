import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeFirst } from 'lib/utils';
import DownloadItemContent from './DownloadItemContent';

const EditableFiles = ( { file } ) => {
  const {
    srcUrl
  } = file;

  const fileType = srcUrl.slice( srcUrl.lastIndexOf( '.' ) + 1 );
  const fileName = srcUrl.slice( srcUrl.lastIndexOf( '/' ) + 1, srcUrl.lastIndexOf( '.' ) );

  return (
    <DownloadItemContent key={ srcUrl } srcUrl={ srcUrl } hoverText={ `Download "${fileName}" (PSD)` }>
      <div className="item-content">
        <p className="item-content__title">
          <strong>Download </strong>
          { `"${fileName}"`}
          <strong>
            {' '}
            (
            { capitalizeFirst( fileType ) }
            )
          </strong>
        </p>
      </div>
    </DownloadItemContent>
  );
};

EditableFiles.propTypes = {
  file: PropTypes.object
};

export default EditableFiles;
