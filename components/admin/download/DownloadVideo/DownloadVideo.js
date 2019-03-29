import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import { object, string, bool } from 'prop-types';
import downloadIcon from 'static/icons/icon_download.svg';

// NOTE: Using the 'download' attribute to trigger downloads
// Need to research more robust options depending on browser supprt
class DownloadVideo extends Component {
  getSizeInfo = ( dimensions, filesize ) => {
    if ( !Object.keys( dimensions ) || !filesize ) return null;
    return {
      label: `${dimensions.width} x ${dimensions.height}`,
      weight: this.formatBytes( filesize )
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
    if ( a.filesize && b.filesize ) {
      return +a.filesize > +b.filesize;
    }
    return true;
  };

  renderFormItem( video, index ) {
    const { title } = this.props.selectedLanguageUnit;
    const size = this.getSizeInfo( video.dimensions, video.filesize );
    const fn = `${title.replace( /\s/g, '_' )}_${video.dimensions.width}.${this.getFnExt( video.url )}`;
    const videoQuality = `${video.quality && video.quality === 'BROADCAST' ? 'broadcast' : 'web'}`;

    return (
      <Item.Group key={ `fs_${index}` } className="download-item">
        <Item as="a" href={ video.url } download={ fn }>
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
    const videos = unit.files.filter( video => ( video.videoBurnedInStatus === 'true' ) === burnedInCaptions );
    const videosWithSizeProp = unit.files.filter( video => video.filesize );

    // only sort the videos if each video has a filesize prop for comparison
    if ( videosWithSizeProp.length === videos.length ) {
      videos.sort( this.sortByFilesize );
    }

    const videosArr = videosWithSizeProp.map( ( v, i ) => v.url && this.renderFormItem( v, i ) );
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
  title: string,
  selectedLanguageUnit: object,
  instructions: string,
  burnedInCaptions: bool
};

export default DownloadVideo;
