import React from 'react';
import PropTypes from 'prop-types';

import { formatBytes, getFileDownloadUrl } from 'lib/utils';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';

// NOTE: Using the 'download' attribute to trigger downloads
// Need to research more robust options depending on browser support
const DownloadVideo = ( { burnedInCaptions, selectedLanguageUnit, isAdminPreview } ) => {
  const getSizeInfo = size => {
    if ( !size ) return null;

    return {
      label: `${size.width} x ${size.height}`,
      weight: formatBytes( size.filesize ),
    };
  };

  const getFnExt = url => {
    const extRe = /([0-9a-z]+)$/i;
    const exts = url.match( extRe );

    return exts[0];
  };

  const sortByFilesize = ( a, b ) => {
    if ( a.size && a.size.filesize && b.size && b.size.filesize ) {
      return +a.size.filesize > +b.size.filesize;
    }

    return true;
  };

  const renderFormItem = video => {
    const { title } = selectedLanguageUnit;
    const size = getSizeInfo( video.size );

    // use actual filename and not project title
    const fn = video.downloadUrl.substr( video.downloadUrl.lastIndexOf( '/' ) + 1 );

    const videoQuality = `${video.video_quality && video.video_quality.toLowerCase() === 'broadcast' ? 'broadcast' : 'web'}`;
    const downloadLink = getFileDownloadUrl( video.downloadUrl, fn );

    return (
      <DownloadItemContent
        key={ downloadLink }
        srcUrl={ downloadLink }
        hoverText={ `Download for ${videoQuality}` }
        isAdminPreview={ isAdminPreview }
        downloadFilename={ fn }
      >
        <div className="item-content">
          <p className="item-content__title">
            <strong>
              { `Download "${title}" for ${videoQuality}` }
            </strong>
          </p>
          <p className="item-content__meta">{ `${video.use} | ${video.use === 'Clean' ? 'No subtitles' : 'Subtitles'}` }</p>
          <p className="item-content__meta">{ `File size: ${size.weight}` }</p>
          <p className="item-content__meta">{ `Dimensions: ${size.label}` }</p>
        </div>
      </DownloadItemContent>
    );
  };

  const renderFormItems = ( unit, captions ) => {
    // fetch all source videos by Clean vs. non-Clean and then sort by file size
    const videos = unit.source.filter( video => {
      const isClean = video.use === 'Clean';

      return captions ? !isClean : isClean;
    } );
    const videosWithSizeProp = videos.filter( video => video.filesize );

    // only sort the videos if each video has a filesize prop for comparison
    if ( videosWithSizeProp.length === videos.length ) {
      // filesize coming in as string, convert to number for comparison
      videos.sort( sortByFilesize );
    }

    const videosArr = videos.map( ( v, i ) => v.downloadUrl && renderFormItem( v, i ) );

    return (
      <div>
        { videosArr.length
          ? videosArr
          : <p className="download-item__noContent">There are no videos available for download at this time</p> }
      </div>
    );
  };

  return (
    <div>
      { selectedLanguageUnit && renderFormItems( selectedLanguageUnit, burnedInCaptions ) }
    </div>
  );
};

DownloadVideo.propTypes = {
  selectedLanguageUnit: PropTypes.object,
  burnedInCaptions: PropTypes.bool,
  isAdminPreview: PropTypes.bool,
};

export default DownloadVideo;
