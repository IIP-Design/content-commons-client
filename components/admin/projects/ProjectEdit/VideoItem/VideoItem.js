/**
 *
 * VideoItem
 *
 */
import React, { Fragment } from 'react';
import { bool, func, string } from 'prop-types';
import {
  Icon, Loader, Progress
} from 'semantic-ui-react';

import './VideoItem.scss';

import { projects } from 'components/admin/projects/ProjectEdit/mockData';

/* eslint-disable react/prefer-stateless-function */
class VideoItem extends React.PureComponent {
  constructor( props ) {
    super( props );

    /**
     * @todo simulate upload for dev purposes;
     * replace for production
     * 1MB = 1,048,576 Bytes
     */
    this.MEGABYTE = 1048576;
    this.MIN_INTERVAL = 500;
    this.MAX_INTERVAL = 1500;
    this.MIN_MB_SEC = 400;
    this.MAX_MB_SEC = 500;

    this.state = {
      video: this.getVideoItem(),
      bytesUploaded: 0,
      nIntervId: null,
      isUploading: false
    };
  }

  componentDidMount = () => {
    /**
     * @todo simulate upload for dev purposes;
     * replace for production
     * min, max interval in milliseconds
     */
    const interval = this.getRandomInt( this.MIN_INTERVAL, this.MAX_INTERVAL );
    const nIntervId = setInterval( this.uploadItem, interval );
    this.setState( { nIntervId } );
  }

  componentWillUnmount = () => {
    clearInterval( this.state.nIntervId );
  }

  /**
   * @todo Replace after GraphQL & Apollo
   */
  getVideoItem = () => {
    const { itemId } = this.props;
    const { videos } = projects[0];
    return videos.find( video => video.id === itemId );
  };

  /**
   * @todo simulate upload for dev purposes;
   * replace for production
   */
  getRandomInt = ( min, max ) => {
    const minNum = Math.ceil( min );
    const maxNum = Math.floor( max );
    return (
      Math.floor( Math.random() * ( ( maxNum - minNum ) + 1 ) ) + minNum
    );
  }

  getRemainingUnits = ( totalUnits, unitsUploaded ) => (
    totalUnits - unitsUploaded
  )

  incrementUpload = ( unit, min, max ) => (
    this[unit] * this.getRandomInt( min, max )
  )

  endUpload = intervId => {
    clearInterval( intervId );
  };

  uploadItem = () => {
    /**
     * @todo simulate upload for dev purposes;
     * replace for production
     * min, max increment in megabytes
     */
    this.setState( nextState => {
      const { filesize } = this.state.video.source[0].size;
      const { bytesUploaded } = nextState;

      const remainingBytes = this.getRemainingUnits( filesize, bytesUploaded );
      let increment = this.incrementUpload( 'MEGABYTE', this.MIN_MB_SEC, this.MAX_MB_SEC );

      if ( remainingBytes < increment ) {
        increment = remainingBytes;
      }

      // continue uploading
      if ( bytesUploaded < filesize ) {
        return {
          bytesUploaded: this.state.bytesUploaded + increment,
          isUploading: true
        };
      }

      // stop uploading
      this.endUpload( nextState.nIntervId );
      return { isUploading: false };
    } );
  }

  render() {
    const {
      onClick,
      displayItemInModal
    } = this.props;

    const { video } = this.state;

    if ( !video || video.loading ) {
      return (
        <Loader active inline="centered">
          <p style={ { fontSize: '0.75em' } }>
            Preparing file for upload...
          </p>
        </Loader>
      );
    }

    const {
      title,
      language,
      thumbnail,
      alt,
      fileName,
      source,
      error,
      uploadStatus
    } = video;

    const { filesize } = source[0].size;
    const { bytesUploaded, isUploading } = this.state;

    const itemStyle = {
      cursor: isUploading ? 'not-allowed' : 'pointer'
    };
    if ( !displayItemInModal ) itemStyle.cursor = 'default';

    const uploadingClass = isUploading ? ' isUploading' : '';
    const Wrapper = !isUploading && displayItemInModal ? 'button' : 'span';
    const wrapperClass = displayItemInModal ? 'modal-trigger' : 'wrapper';

    if ( error || uploadStatus.error ) {
      return (
        <li className="item video error" style={ { textAlign: 'center' } }>
          <Icon
            color="red"
            name="exclamation triangle"
            size="large"
          />
          <p style={ { fontSize: '0.75em' } }>
            { `${error ? 'A loading' : 'An uploading'} error occurred for this item.` }
          </p>
        </li>
      );
    }

    return (
      <li className="item video">
        <Wrapper
          className={ wrapperClass }
          onClick={
            !isUploading && displayItemInModal ? onClick : null
          }
          style={ itemStyle }
        >
          <div className={ `thumbnail${uploadingClass}` }>
            { thumbnail
              && (
                <Fragment>
                  <img src={ thumbnail } alt={ alt } />
                  <p className="file-name">{ fileName }</p>
                </Fragment>
              ) }
            { isUploading
              && (
                <div className="loading-animation">
                  <Loader active inline="centered" />
                </div>
              ) }
          </div>
          { isUploading
            && (
              <Progress
                value={ bytesUploaded }
                total={ filesize }
                color="blue"
                size="small"
                active
                progress
                precision={ 0 }
              >
                <p>Upload in progress</p>
              </Progress>
            ) }
          <h3 className={ `item-heading ${language.text_direction}` }>{ title }</h3>
          <p className="item-lang">{ language.display_name }</p>
        </Wrapper>
      </li>
    );
  }
}

VideoItem.propTypes = {
  // video: object,
  displayItemInModal: bool,
  onClick: func,
  // videoID: string.isRequired,
  itemId: string.isRequired
};

export default VideoItem;
