import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { uploadToS3, uploadToVimeo, getFileMetadata } from 'lib/upload';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/upload';
import { SIGNED_S3_URL_MUTATION, FILE_INFO_MUTATION } from 'lib/graphql/queries/util';

const withFileUpload = WrappedComponent => {
  class _withFileUpload extends PureComponent {
    static propTypes = {
      getSignedS3Url: PropTypes.func.isRequired,
      getFileInfo: PropTypes.func,
      updateFile: PropTypes.func.isRequired
    };


    upload = async ( projectId, files, callback ) => {
      const { getSignedS3Url, getFileInfo, updateFile } = this.props;

      await Promise.all( files.map( async file => {
        const isVideo = file.input.type.includes( 'video' );
        const isImage = file.input.type.includes( 'image' );

        let result = await uploadToS3( projectId, file, getSignedS3Url, callback )
          .catch( err => {
            console.dir( err );
            file.error = true;
          } );

        file.contentType = result.contentType;
        file.s3Path = result.path;

        // if video, upload to vimeo
        if ( isVideo ) {
          file.stream = {};
          file.stream.vimeo = await uploadToVimeo( file )
            .catch( err => {
              console.dir( err );
              file.error = true;
            } );
        }

        //  if video or image, fetch file metadata (this call takes a bit long so may need to fix)
        if ( isVideo || isImage ) {
          result = await getFileMetadata( getFileInfo, encodeURI( file.s3Path ) ).catch( err => { console.dir( err ); } );
          if ( result ) {
            const {
              duration, bitrate, width, height
            } = result;
            file.duration = duration;
            file.bitrate = bitrate;
            file.width = width;
            file.height = height;
          }
        }

        // update redux state with new file props
        updateFile( file );
      } ) );
    }


    render() {
      return <WrappedComponent { ...this.props } uploadExecute={ this.upload } />;
    }
  }


  return compose(
    connect( null, actions ),
    graphql( SIGNED_S3_URL_MUTATION, { name: 'getSignedS3Url' } ),
    graphql( FILE_INFO_MUTATION, { name: 'getFileInfo' } )
  )( _withFileUpload );
};


export default withFileUpload;
