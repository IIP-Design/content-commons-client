import React from 'react';
import PropTypes from 'prop-types';
import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';
import { formatBytes, getFileExt, getFileDownloadUrl } from 'lib/utils';

const GraphicFiles = ( { file, isAdminPreview } ) => {
  const {
    title,
    url,
    social,
    filename,
    filesize,
    width,
    height,
  } = file;

  const downloadURL = getFileDownloadUrl( url, filename );

  const fileType = getFileExt( filename );

  const getSocialPlatform = () => {
    if ( isAdminPreview ) {
      const platforms = social.map( platform => platform.name );

      return platforms.join( '/' );
    }

    return social;
  };

  return (
    <DownloadItemContent
      srcUrl={ downloadURL }
      hoverText={ `Download for ${getSocialPlatform()}` }
      isAdminPreview={ isAdminPreview }
    >
      <div className="item-content">
        <p className="item-content__title">
          <strong>
            Download
            { ` "${title}"` }
            { ` for ${getSocialPlatform()}` }
          </strong>
        </p>
        <p className="item-content__meta">{ `File type: ${fileType}` }</p>
        <p className="item-content__meta">{ `File size: ${formatBytes( filesize )}` }</p>
        <p className="item-content__meta">{ `Dimensions: ${width} x ${height}` }</p>
      </div>
    </DownloadItemContent>
  );
};

GraphicFiles.propTypes = {
  file: PropTypes.object,
  isAdminPreview: PropTypes.bool,
};

export default GraphicFiles;
