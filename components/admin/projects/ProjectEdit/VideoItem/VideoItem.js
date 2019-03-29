/**
 *
 * VideoItem
 *
 */
import React, { Fragment } from 'react';
import { bool, func, object } from 'prop-types';
import {
  Icon, Loader, Progress
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import Placeholder from 'components/Placeholder/Placeholder';
import './VideoItem.scss';

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

  getAspectRatio = () => {
    const { thumbnails } = this.props.data.video;
    if ( thumbnails && thumbnails.length ) {
      const { height, width } = thumbnails[0].dimensions;
      return height / width * 100;
    }

    // default to HD aspect ratio
    return 9 / 16 * 100;
  }

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
      const { filesize } = this.props.data.video.files[0];
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
      data: { error, loading, video },
      onClick,
      displayItemInModal
    } = this.props;

    if ( !video ) return null;

    if ( loading ) {
      return (
        <Loader active inline="centered">
          <p style={ { fontSize: '0.75em' } }>
            Preparing file for upload...
          </p>
        </Loader>
      );
    }

    if ( error ) {
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

    const {
      title,
      language,
      thumbnails,
      files
    } = video;

    const hasVideoFiles = files && files.length;
    const hasThumbnails = thumbnails && thumbnails.length;

    const filename = hasVideoFiles ? files[0].filename : 'filename';
    const filesize = hasVideoFiles ? files[0].filesize : 0;

    const alt = hasThumbnails ? thumbnails[0].image.alt : '';
    const url = hasThumbnails ? thumbnails[0].image.url : '';

    const { bytesUploaded, isUploading } = this.state;

    const itemStyle = {
      cursor: isUploading ? 'not-allowed' : 'pointer'
    };
    if ( !displayItemInModal ) itemStyle.cursor = 'default';

    const uploadingClass = isUploading ? ' isUploading' : '';
    const Wrapper = !isUploading && displayItemInModal ? 'button' : 'span';
    const wrapperClass = displayItemInModal ? 'modal-trigger' : 'wrapper';

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
            <Fragment>
              { hasThumbnails
                ? <img src={ url } alt={ alt } />
                : (
                  <Placeholder
                    parentEl="div"
                    childEl="div"
                    parentStyles={ {
                      position: 'relative',
                      overflow: 'hidden',
                      height: '0',
                      paddingTop: `${this.getAspectRatio()}%`
                    } }
                    childStyles={ {
                      thumbnail: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        height: '100%',
                        width: '100%'
                      }
                    } }
                  />
                ) }
              <p className="file-name">{ filename }</p>
            </Fragment>

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

          <h3 className={ `item-heading ${language.textDirection}` }>
            { title }
          </h3>
          <p className="item-lang">{ language.displayName }</p>
        </Wrapper>
      </li>
    );
  }
}

VideoItem.propTypes = {
  data: object.isRequired,
  displayItemInModal: bool,
  onClick: func
};

const VIDEO_ITEM_QUERY = gql`
  query VideoItem($id: ID!) {
    video: videoUnit(id: $id) {
      id
      title
      files {
        filename
        filesize
      }
      thumbnails {
        image {
          alt
          url
          dimensions {
            height
            width
          }
        }
      }
      language {
        displayName
        textDirection
      }
    }
  }
`;

export default graphql( VIDEO_ITEM_QUERY, {
  options: props => ( {
    variables: {
      id: props.itemId
    },
  } )
} )( VideoItem );
export { VIDEO_ITEM_QUERY };
