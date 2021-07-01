import PropTypes from 'prop-types';

import useSignedUrl from 'lib/hooks/useSignedUrl';

import downloadIcon from 'static/icons/icon_download.svg';

import './DownloadItemContent.scss';

const DownloadItemContent = ( {
  isAdminPreview,
  srcUrl,
  hoverText,
  children,
  downloadFilename,
} ) => {
  const { signedUrl } = useSignedUrl( srcUrl );

  return (
    <a
      key={ signedUrl }
      href={ signedUrl }
      rel="noopener noreferrer"
      download={ downloadFilename || true }
      className={ isAdminPreview ? 'download-item download-item--preview' : 'download-item' }
    >
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
  downloadFilename: PropTypes.string,
  children: PropTypes.oneOfType( [
    PropTypes.object,
    PropTypes.array,
  ] ),
};

export default DownloadItemContent;
