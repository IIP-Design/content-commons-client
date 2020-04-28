import React from 'react';
import PropTypes from 'prop-types';
import DownloadItemContent from './DownloadItemContent';

const GraphicFiles = ( { file } ) => {
  const {
    title,
    srcUrl,
    social,
    filesize,
    width,
    height
  } = file;

  return (
    <DownloadItemContent key={ srcUrl } srcUrl={ srcUrl } hoverText={ `Download for ${social}` }>
      <div className="item-content">
        <p className="item-content__title">
          <strong>Download </strong>
          { `"${title}" `}
          <strong>
            {' '}
            for
            { social }
          </strong>
        </p>
        <p className="item-content__meta">File type: NEED FILETYPE PROP</p>
        <p className="item-content__meta">
          File size:
          { filesize }
        </p>
        <p className="item-content__meta">
          Dimensions:
          { `${width} x ${height}` }
        </p>
      </div>
    </DownloadItemContent>
  );
};

GraphicFiles.propTypes = {
  file: PropTypes.object
};

export default GraphicFiles;
