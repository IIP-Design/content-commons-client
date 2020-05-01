import React from 'react';
import PropTypes from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';
import './DownloadItemContent.scss';

/* eslint-disable-next-line import/no-unresolved */
import tempSrcUrl from './graphicPlaceHolderImg.png';

const DownloadItemContent = props => {
  const {
    isAdminPreview,
    srcUrl,
    hoverText,
    children
  } = props;

  return (
    <a key={ srcUrl } href={ tempSrcUrl } download className={ isAdminPreview ? 'download-item download-item--preview' : 'download-item' }>
      <div className="item-icon"><img src={ downloadIcon } alt={ hoverText } /></div>
      { children }
      <span className="item-hover">
        { hoverText }
        { isAdminPreview && <span className="preview-text">The link will be active after publishing.</span> }
      </span>
    </a>
  );
};

DownloadItemContent.propTypes = {
  isAdminPreview: PropTypes.bool,
  srcUrl: PropTypes.string,
  hoverText: PropTypes.string,
  children: PropTypes.oneOfType( [
    PropTypes.object,
    PropTypes.array
  ] )
};

export default DownloadItemContent;
