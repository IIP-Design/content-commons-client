import React from 'react';
import PropTypes from 'prop-types';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';
import { capitalizeFirst } from 'lib/utils';

const GenericFiles = ( { file, isAdminPreview } ) => {
  const {
    srcUrl,
    filename
  } = file;

  const fileName = filename.slice( 0, filename.indexOf( '.' ) );
  let fileType = filename.slice( filename.lastIndexOf( '.' ) + 1 );

  fileType = capitalizeFirst( fileType );

  return (
    <DownloadItemContent
      key={ srcUrl }
      srcUrl={ srcUrl }
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
  isAdminPreview: PropTypes.bool
};

export default GenericFiles;