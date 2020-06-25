import React from 'react';
import PropTypes from 'prop-types';
import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';
import { capitalizeFirst, getFileDownloadUrl } from 'lib/utils';

const GenericFiles = ( { file, isAdminPreview } ) => {
  const {
    url,
    filename,
  } = file;

  const downloadURL = getFileDownloadUrl( url, filename );

  const fileName = filename.slice( 0, filename.indexOf( '.' ) );
  let fileType = filename.slice( filename.lastIndexOf( '.' ) + 1 );

  fileType = capitalizeFirst( fileType );

  return (
    <DownloadItemContent
      srcUrl={ downloadURL }
      hoverText={ `Download "${fileName}" (${fileType})` }
      isAdminPreview={ isAdminPreview }
    >
      <div className="item-content">
        <p className="item-content__title">
          <strong>Download </strong>
          { `"${fileName}"` }
          <strong>{` (${fileType})`}</strong>
        </p>
      </div>
    </DownloadItemContent>
  );
};

GenericFiles.propTypes = {
  file: PropTypes.object,
  isAdminPreview: PropTypes.bool,
};

export default GenericFiles;
