import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { object, string, bool } from 'prop-types';
import downloadIcon from '../../static/icons/icon_download.svg';

// NOTE: Using the 'download' attribute to trigger downloads
// Need to research more robust options depending on browser supprt
class DownloadVideo extends Component {
  getSrt() {
    const arr = [];
    const unit = this.props.selectedLanguageUnit;
    if ( unit && unit.srt && unit.srt.srcUrl ) {
      arr.push( unit.srt.srcUrl );
    }

    return arr;
  }

  getSizeInfo = size => {
    if ( !size ) return null;
    return {
      label: `${size.width} x ${size.height}`,
      weight: this.formatBytes( size.filesize )
    };
  };

  getFnExt = url => {
    const extRe = /([0-9a-z]+)$/i;
    const exts = url.match( extRe );
    return exts[0];
  };

  formatBytes = ( bytes, decimals ) => {
    if ( bytes === 0 ) return;
    const k = 1024;
    const dm = decimals || 2;
    const sizes = [
      'Bytes',
      'KB',
      'MB',
      'GB',
      'TB'
    ];
    const i = Math.floor( Math.log( bytes ) / Math.log( k ) );
    return `${parseFloat( ( bytes / ( k ** i ) ).toFixed( dm ) )}  ${sizes[i]}`;
  };

  sortByFilesize = ( a, b ) => {
    if ( a.size && a.size.filesize && b.size && b.size.filesize ) {
      return +a.size.filesize > +b.size.filesize;
    }
    return true;
  };

  renderFormItem( video, index ) {
    const { title } = this.props.selectedLanguageUnit;
    const size = this.getSizeInfo( video.size );
    const fn = `${title.replace( /\s/g, '_' )}_${video.size.width}.${this.getFnExt( video.downloadUrl )}`;
    const videoQuality = `${video.video_quality && video.video_quality === 'broadcast' ? 'broadcast' : 'web'}`;

    return (
      <Item.Group key={ `fs_${index}` } className="download-item">
        <Item as="a" href={ video.downloadUrl } download={ fn }>
          <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
          <Item.Content>
            <Item.Header className="download-header">
              Download
              { ' ' }
              <span className="lightweight">{ `"${title}"` }</span>
              { ' ' }
for
              { ' ' }
              { `${videoQuality}` }
            </Item.Header>
            <Item.Meta>
              { ' ' }
              { `File size: ${size.weight}` }
              { ' ' }
            </Item.Meta>
            <Item.Meta>
              { ' ' }
              { `Dimensions: ${size.label}` }
            </Item.Meta>
            <span className="item_hover">{ `Download for ${videoQuality}` }</span>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  }

  renderFormItems( unit, burnedInCaptions ) {
    // fetch all source videos with NO burned in captions and then sort by file size
    const videos = unit.source.filter( video => ( video.burnedInCaptions === 'true' ) === burnedInCaptions );
    const videosWithSizeProp = unit.source.filter( video => video.size && video.size.filesize );

    // only sort the videos if each video has a filesize prop for comparison
    if ( videosWithSizeProp.length === videos.length ) {
      // filesize coming in as string, convert to number for comparision
      videos.sort( this.sortByFilesize );
    }

    const videosArr = videos.map( ( v, i ) => v.downloadUrl && this.renderFormItem( v, i ) );
    return <div>{ videosArr.length ? videosArr : 'There are no videos available for download at this time' }</div>;
  }

  render() {
    const { selectedLanguageUnit, burnedInCaptions } = this.props;
    return (
      <div>
        <div className="form-group_instructions">{ this.props.instructions }</div>
        { this.props.selectedLanguageUnit && this.renderFormItems( selectedLanguageUnit, burnedInCaptions ) }
      </div>
    );
  }
}

DownloadVideo.propTypes = {
  selectedLanguageUnit: object,
  instructions: string,
  burnedInCaptions: bool
};

export default DownloadVideo;
