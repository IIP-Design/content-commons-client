import PropTypes from 'prop-types';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';

import { formatBytes, getS3Url } from 'lib/utils';

// NOTE: Using the 'download' attribute to trigger downloads
// Need to research more robust options depending on browser support
const DownloadVideo = ( { selectedLanguageUnit, burnedInCaptions, isPreview } ) => {
  const getSizeInfo = ( dimensions, filesize ) => {
    if ( !Object.keys( dimensions ) || !filesize ) return null;

    return {
      label: `${dimensions.width} x ${dimensions.height}`,
      weight: formatBytes( filesize ),
    };
  };

  const sortByFilesize = ( a, b ) => {
    if ( a.filesize && b.filesize ) {
      return +a.filesize > +b.filesize;
    }

    return true;
  };

  const renderFormItem = video => {
    const { id, title } = selectedLanguageUnit;
    const size = getSizeInfo( video.dimensions, video.filesize );
    const videoQuality = `${video.quality && video.quality === 'BROADCAST' ? 'broadcast' : 'web'}`;

    return (
      <DownloadItemContent
        key={ `fs_${id}-${video.id}` }
        srcUrl={ getS3Url( video.url ) }
        hoverText={ `Download for ${videoQuality}` }
        isAdminPreview={ isPreview }
      >
        <div className="item-content">
          <p className="item-content__title">
            <strong>
              { `Download "${title}" for ${videoQuality}` }
            </strong>
          </p>
          <p className="item-content__meta">{ `${video.use.name} | ${video.videoBurnedInStatus === 'CLEAN' ? 'No subtitles' : 'Subtitles'}` }</p>
          <p className="item-content__meta">{ `File size: ${size.weight}` }</p>
          <p className="item-content__meta">{ `Dimensions: ${size.label}` }</p>
        </div>
      </DownloadItemContent>
    );
  };

  const renderFormItems = unit => {
    // fetch all source videos by Clean vs. non-Clean and then sort by file size
    const videos = unit.files.filter( video => {
      const isClean = video.use.name === 'Clean';

      return burnedInCaptions ? !isClean : isClean;
    } );
    const videosWithSizeProp = videos.filter( video => video.filesize );

    // only sort the videos if each video has a filesize prop for comparison
    if ( videosWithSizeProp.length === videos.length ) {
      videos.sort( sortByFilesize );
    }

    const videosArr = videosWithSizeProp
      .map( ( v, i ) => v.url && renderFormItem( v, i ) );

    return <div>{ videosArr.length ? videosArr : 'There are no videos available for download at this time' }</div>;
  };

  return selectedLanguageUnit && renderFormItems( selectedLanguageUnit, burnedInCaptions );
};

DownloadVideo.propTypes = {
  selectedLanguageUnit: PropTypes.object,
  burnedInCaptions: PropTypes.bool,
  isPreview: PropTypes.bool,
};

export default DownloadVideo;
