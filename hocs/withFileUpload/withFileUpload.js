import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { uploadToS3, uploadToVimeo, getFileMetadata } from 'lib/upload';
import { graphql } from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';
import {
  SIGNED_S3_URL_PUT_MUTATION,
  SIGNED_S3_URL_GET_MUTATION,
  FILE_INFO_MUTATION,
} from 'lib/graphql/queries/util';

const withFileUpload = WrappedComponent => {
  class _withFileUpload extends PureComponent {
    // eslint-disable-next-line react/static-property-placement
    static propTypes = {
      getSignedS3UrlGet: PropTypes.func.isRequired,
      getSignedS3UrlPut: PropTypes.func.isRequired,
      getFileInfo: PropTypes.func,
    };

    /**
     * Uploads files to S3 using a secure signed url
     * @param {string} projectId Either a assetPath (w/o trailing /) or an id from which to construct an assetPath on the server
     * @param {array} files files to upload
     * @param {func} callback Callback to send upload progress events to
     * @param {func} updateFn Function to run on successful file upload
     */
    upload = async ( projectId, files, callback, updateFn ) => {
      const { getSignedS3UrlPut, getSignedS3UrlGet, getFileInfo } = this.props;

      return Promise.all(
        files.map( async file => {
          const isVideo = file.input.type.includes( 'video' );
          const isImage = file.input.type.includes( 'image' );

          let result = await uploadToS3( projectId, file, getSignedS3UrlPut, callback ).catch( err => {
            file.error = !!err;
          } );

          file.error = result.error;

          // if successful upload to s3
          if ( !file.error ) {
            file.contentType = result.contentType;
            file.s3Path = result.path;

            if ( isVideo ) {
              file.stream = {};
              file.stream.vimeo = await uploadToVimeo( file, getSignedS3UrlGet ).catch( err => {
                console.dir( err );
                file.error = !!err;
              } );
            }

            //  if video or image, fetch file metadata (this call takes a bit long so may need to fix)
            if ( isVideo || isImage ) {
              result = await getFileMetadata( getFileInfo, encodeURI( file.s3Path ) ).catch( err => {
                console.dir( err );
              } );

              if ( result ) {
                const {
                  duration, bitrate, width, height,
                } = result;

                file.duration = duration;
                file.bitrate = bitrate;
                file.width = width;
                file.height = height;
              }
            }

            // update reducer state with new file props
            if ( updateFn && typeof updateFn === 'function' ) {
              updateFn( file );
            }
          }

          return file;
        } ),
      );
    };

    render() {
      return <WrappedComponent { ...this.props } uploadExecute={ this.upload } />;
    }
  }

  return compose(
    graphql( SIGNED_S3_URL_PUT_MUTATION, { name: 'getSignedS3UrlPut' } ),
    graphql( SIGNED_S3_URL_GET_MUTATION, { name: 'getSignedS3UrlGet' } ),
    graphql( FILE_INFO_MUTATION, { name: 'getFileInfo' } ),
  )( _withFileUpload );
};

export default withFileUpload;
