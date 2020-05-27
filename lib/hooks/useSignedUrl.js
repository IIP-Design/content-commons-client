import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { SIGNED_S3_URL_GET_MUTATION } from 'lib/graphql/queries/util';
import { getPathToS3Bucket, getS3UrlKey } from 'lib/utils';

/**
 * Uploads single or multiple files to S3
 */
const useSignedUrl = url => {
  const [getSignedS3UrlGet] = useMutation( SIGNED_S3_URL_GET_MUTATION );
  const [signedUrl, setSignedUrl] = useState( '' );

  const path = getPathToS3Bucket();

  useEffect( () => {
    if ( !url ) return;

    const getSignedUrl = async () => {
      const result = await getSignedS3UrlGet( {
        variables: {
          bucket: 'prod',
          key: getS3UrlKey( url ),
        },
      } );

      if ( result?.data?.getSignedS3UrlGet?.url ) {
        setSignedUrl( result.data.getSignedS3UrlGet.url );
      }
    };

    // Checks if url is to the S3 bucket and passes it through if not
    if ( url.includes( path ) ) {
      getSignedUrl();
    } else {
      setSignedUrl( url );
    }
  }, [
    getSignedS3UrlGet, path, url,
  ] );

  return {
    signedUrl,
  };
};

export default useSignedUrl;
