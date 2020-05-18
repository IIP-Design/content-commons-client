import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';

import { formatBytes, getVideoDownloadLink } from 'lib/utils';

import downloadIcon from 'static/icons/icon_download.svg';

// NOTE: Using the 'download' attribute to trigger downloads
// Need to research more robust options depending on browser support
const DownloadVideo = ( { burnedInCaptions, instructions, selectedLanguageUnit } ) => {
  const getSrt = () => {
    const arr = [];
    const unit = selectedLanguageUnit;

    if ( unit && unit.srt && unit.srt.srcUrl ) {
      arr.push( unit.srt.srcUrl );
    }

    return arr;
  };

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

  const renderFormItem = ( video, index ) => {
    const { title } = selectedLanguageUnit;
    const size = getSizeInfo( video.size );
    const fn = `${title.replace( /\s/g, '_' )}_${video.size.width}.${getFnExt( video.downloadUrl )}`;
    const videoQuality = `${video.video_quality && video.video_quality.toLowerCase() === 'broadcast' ? 'broadcast' : 'web'}`;
    const downloadLink = getVideoDownloadLink( video.downloadUrl, fn );

    return (
      <Item.Group key={ `fs_${index}` } className="download-item">
        <Item as="a" href={ downloadLink } download={ fn }>
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">
              { 'Download '}
              <span className="lightweight">{ `"${title}"` }</span>
              { ` for ' ${videoQuality}` }
            </Item.Header>
            <Item.Meta>
              { ` File size: ${size.weight} ` }
            </Item.Meta>
            <Item.Meta>
              { ` Dimensions: ${size.label}` }
            </Item.Meta>
            <span className="item_hover">{ `Download for ${videoQuality}` }</span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  };

  const renderFormItems = ( unit, captions ) => {
    // fetch all source videos with NO burned in captions and then sort by file size
    const videos = unit.source.filter( video => video.burnedInCaptions === 'true' === captions );
    const videosWithSizeProp = unit.source.filter( video => video.size && video.size.filesize );

    // only sort the videos if each video has a filesize prop for comparison
    if ( videosWithSizeProp.length === videos.length ) {
      // filesize coming in as string, convert to number for comparison
      videos.sort( sortByFilesize );
    }

    const videosArr = videos.map( ( v, i ) => v.downloadUrl && renderFormItem( v, i ) );

    return <div>{ videosArr.length ? videosArr : 'There are no videos available for download at this time' }</div>;
  };

  return (
    <div>
      <div className="form-group_instructions">{ instructions }</div>
      { selectedLanguageUnit && renderFormItems( selectedLanguageUnit, burnedInCaptions ) }
    </div>
  );
};

DownloadVideo.propTypes = {
  selectedLanguageUnit: PropTypes.object,
  instructions: PropTypes.string,
  burnedInCaptions: PropTypes.bool,
};

export default DownloadVideo;
