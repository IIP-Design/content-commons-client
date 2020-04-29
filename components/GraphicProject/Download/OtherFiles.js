import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeFirst } from 'lib/utils';
import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';

const OtherFiles = ( { file } ) => {
  const {
    srcUrl
  } = file;

  let fileType = srcUrl.slice( srcUrl.lastIndexOf( '.' ) + 1 );

  fileType = capitalizeFirst( fileType );
  const fileName = srcUrl.slice( srcUrl.lastIndexOf( '/' ) + 1, srcUrl.lastIndexOf( '.' ) );

  return (
    <DownloadItemContent key={ srcUrl } srcUrl={ srcUrl } hoverText={ `Download "${fileName}" (${fileType})` }>
      <div className="item-content">
        <p className="item-content__title">
          <strong>Download </strong>
          { `"${fileName}"`}
          <strong>
            {' '}
            (
            { fileType }
            )
          </strong>
        </p>
      </div>
    </DownloadItemContent>
  );
};

OtherFiles.propTypes = {
  file: PropTypes.object
};

export default OtherFiles;
