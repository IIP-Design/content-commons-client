import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import { SIGNED_S3_URL_GET_MUTATION } from 'lib/graphql/queries/util';
import { getPathToS3Bucket, getS3UrlKey } from 'lib/utils';

/**
 * Uploads single or multiple files to S3
 */
const useSignedUrl = ( url, fallback ) => {
  const [getSignedS3UrlGet] = useMutation( SIGNED_S3_URL_GET_MUTATION );
  const [signedUrl, setSignedUrl] = useState( '' );

  const path = getPathToS3Bucket();

  useEffect( () => {
    if ( !url ) return;

    let isMounted = true;

    const getSignedUrl = async () => {
      const result = await getSignedS3UrlGet( {
        variables: {
          bucket: 'prod',
          key: getS3UrlKey( url ),
        },
      } );

      if ( isMounted ) {
        if ( result?.data?.getSignedS3UrlGet?.url ) {
          setSignedUrl( result.data.getSignedS3UrlGet.url );
        } else {
          setSignedUrl( fallback || '' );
        }
      }
    };

    // Checks if url is to the S3 bucket and passes it through if not
    if ( url.includes( path ) && !url.includes( 'AWSAccessKeyId' ) ) {
      getSignedUrl();
    } else if ( isMounted ) {
      setSignedUrl( url );
    }

    // Cleanup in the event the component is unmounted
    return () => {
      isMounted = false;
    };
  }, [
    fallback, getSignedS3UrlGet, path, url,
  ] );

  return {
    signedUrl,
  };
};

export default useSignedUrl;
