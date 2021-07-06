import PropTypes from 'prop-types';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';

import useSignedUrl from 'lib/hooks/useSignedUrl';

const SignedUrlLink = ( { file, isPreview } ) => {
  const { filename, url } = file;
  const { signedUrl } = useSignedUrl( url );

  return (
    <DownloadItemContent
      srcUrl={ signedUrl }
      hoverText={ `Download ${filename}` }
      isAdminPreview={ isPreview }
      downloadFilename={ filename }
    >
      <div className="item-content">
        <p className="item-content__title">
          <strong>{ `Download ${filename}` }</strong>
        </p>
      </div>
    </DownloadItemContent>
  );
};

SignedUrlLink.propTypes = {
  file: PropTypes.object,
  isPreview: PropTypes.bool,
};

export default SignedUrlLink;
