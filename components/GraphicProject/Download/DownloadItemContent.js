import React from 'react';
import PropTypes from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';
import './DownloadItemContent.scss';

/* eslint-disable-next-line import/no-unresolved */
import tempSrcUrl from '../graphicPlaceHolderImg.png';

const DownloadItemContent = props => {
  const {
    srcUrl,
    hoverText,
    children
  } = props;

  return (
    <a key={ srcUrl } href={ tempSrcUrl } download className="download-item">
      <div className="item-icon"><img src={ downloadIcon } alt={ hoverText } /></div>
      { children }
      <span className="item-hover">{ hoverText }</span>
    </a>
  );
};

DownloadItemContent.propTypes = {
  srcUrl: PropTypes.string,
  hoverText: PropTypes.string,
  children: PropTypes.object
};

export default DownloadItemContent;
