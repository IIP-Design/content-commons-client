import React from 'react';
import PropTypes from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';
import './DownloadItem.scss';

/* eslint-disable-next-line import/no-unresolved */
import tempSrcUrl from '../graphicPlaceHolderImg.png';

const DownloadItem = ( { items, instructions } ) => {
  const renderItem = item => {
    const {
      title,
      srcUrl,
      filesize,
      width,
      height,
      social
    } = item;

    return (
      <a key={ srcUrl } href={ tempSrcUrl } download className="download-item">
        <div className="item-icon"><img src={ downloadIcon } alt={ `Download ${title} for ${social}` } /></div>
        <div className="item-content">
          <p className="item-content__title">
            <strong>Download</strong>
            {' '}
            { `"${title}"`}
            {' '}
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
        <span className="item-hover">{ `Download for ${social}` }</span>
      </a>
    );
  };

  return (
    <div className="download-item__wrapper">
      <p className="download-item__instructions">{ instructions }</p>
      { items.map( renderItem ) }
    </div>
  );
};

DownloadItem.propTypes = {
  items: PropTypes.array,
  instructions: PropTypes.string
};

export default DownloadItem;
