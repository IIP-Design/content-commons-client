import gql from 'graphql-tag';

export const SIGNED_S3_URL_MUTATION = gql` 
  mutation SIGNED_S3_URL_MUTATION( $contentType: String!, $filename: String!, $projectId: String! ) { 
    getSignedS3Url( contentType: $contentType, filename: $filename, projectId: $projectId ) {
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
