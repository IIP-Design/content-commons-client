import { gql } from '@apollo/client';

export const SIGNED_S3_URL_PUT_MUTATION = gql` 
  mutation SIGNED_S3_URL_PUT_MUTATION( $contentType: String!, $filename: String!, $projectId: String! ) { 
    getSignedS3UrlPut( contentType: $contentType, filename: $filename, projectId: $projectId ) {
      key
      url
    }
}
`;

export const SIGNED_S3_URL_GET_MUTATION = gql` 
  mutation SIGNED_S3_URL_GET_MUTATION( $key: String!, $bucket: String  ) { 
    getSignedS3UrlGet( key: $key, bucket: $bucket ) {
      key
      url
    }
  }
`;

export const FILE_INFO_MUTATION = gql` 
  mutation FILE_INFO_MUTATION( $path: String! ) { 
    getFileInfo( path: $path) {
     duration
     bitrate
     width
     height
    }
}
`;
