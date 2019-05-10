import gql from 'graphql-tag';

const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY( $id: ID! ) {
    videoProject( id: $id ) {
      projectTitle
      descPublic
      descInternal 
      status
      visibility
      categories {
        id
      }
      tags {
        id
      }
      supportFiles {
        id
        filename
        filetype
        filesize
        language {
          id
          displayName
        }
      } 
      thumbnails {
        id
        filename
        filetype
        filesize
        language {
          id
          displayName
        }
      } 
    }
}
`;

export { VIDEO_PROJECT_QUERY };
