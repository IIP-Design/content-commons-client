import React from 'react';
import PropTypes from 'prop-types';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';

const GraphicFiles = ( { file, isAdminPreview } ) => {
  const {
    title,
    srcUrl,
    social,
    filename,
    filesize,
    width,
    height
  } = file;

  const fileType = filename.slice( filename.lastIndexOf( '.' ) );

  return (
    <DownloadItemContent
      key={ srcUrl }
      srcUrl={ srcUrl }
      hoverText={ `Download for ${social}` }
      isAdminPreview={ isAdminPreview }
    >
      <div className="item-content">
        <p className="item-content__title">
          <strong>Download </strong>
          { `"${title}"` }
          <strong>{` for ${social}`}</strong>
        </p>
        <p className="item-content__meta">{ `File type: ${fileType}` }</p>
        <p className="item-content__meta">{ `File size: ${filesize}` }</p>
        <p className="item-content__meta">{ `Dimensions: ${width} x ${height}` }</p>
      </div>
    </DownloadItemContent>
  );
};

GraphicFiles.propTypes = {
  file: PropTypes.object,
  isAdminPreview: PropTypes.bool
};

export default GraphicFiles;
