import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import {
  SIGNED_S3_URL_PUT_MUTATION,
  SIGNED_S3_URL_GET_MUTATION
} from 'lib/graphql/queries/util';

const withSignedUrl = WrappedComponent => {
  class _withSignedUrl extends PureComponent {
    // eslint-disable-next-line react/static-property-placement
    static propTypes = {
      getSignedS3UrlGet: PropTypes.func.isRequired,
      getSignedS3UrlPut: PropTypes.func.isRequired
    };

    getSignedS3Url = async ( variables, mutation ) => mutation( {
      variables
    } ).catch( err => {
      console.dir( err );
    } );

    getSignedUrlGet = async assetPath => {
      try {
        const res = await this.getSignedS3Url( {
          key: assetPath
        }, this.props.getSignedS3UrlGet );

        return res.data.getSignedS3UrlGet.url;
      } catch ( err ) {
        console.log( `Unable to get signed url${err}` );
        return null;
      }
    };

    getSignedUrlPut = async assetPath => {
      try {
        const res = await this.getSignedS3Url( {
          key: assetPath
        }, this.props.getSignedS3UrlPut );

        return res.data.getSignedS3UrlPut.url;
      } catch ( err ) {
        console.log( `Unable to get signed url${err}` );
        return null;
      }
    };

    render() {
      return (
        <WrappedComponent
          { ...this.props }
          getSignedUrlGet={ this.getSignedUrlGet }
          getSignedUrlPut={ this.getSignedUrlPut }
        />
      );
    }
  }


  return compose(
    graphql( SIGNED_S3_URL_PUT_MUTATION, { name: 'getSignedS3UrlPut' } ),
    graphql( SIGNED_S3_URL_GET_MUTATION, { name: 'getSignedS3UrlGet' } )
  )( _withSignedUrl );
};


export default withSignedUrl;
