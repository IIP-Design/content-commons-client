import gql from 'graphql-tag';

export const CREATE_VIDEO_PROJECT_MUTATION = gql`
  mutation CREATE_VIDEO_PROJECT_MUTATION( $data: VideoProjectCreateInput! ) {
    createVideoProject( data: $data ) {
      id
      projectTitle
    }
}
`;

export const UPDATE_VIDEO_UNIT_MUTATION = gql`
 mutation UPDATE_VIDEO_UNIT_MUTATION( $data: VideoUnitUpdateInput!, $where: VideoUnitWhereUniqueInput!) {
  updateVideoUnit(data: $data, where: $where) {
    id
    thumbnails {
      id
      size
      image {
        url
      }
    }
  } 
 }
`;

export const UPDATE_VIDEO_PROJECT_MUTATION = gql`
  mutation UPDATE_VIDEO_PROJECT_MUTATION( $data: VideoProjectUpdateInput!, $where:VideoProjectWhereUniqueInput!) {
    updateVideoProject(data: $data, where: $where) {
      id
      projectTitle
      thumbnails {
        id 
        language {
          id
          displayName
          locale
        }
      } 
      units {
        id
        language {
          id
          displayName
        }
      }
    }
  }
`;

export const DELETE_VIDEO_PROJECT_MUTATION = gql`
  mutation DELETE_VIDEO_PROJECT_MUTATION($id: ID!) {
    deleteVideoProject(id: $id) {
      id
    }
  }
`;

export const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY( $id: ID! ) {
    videoProject( id: $id ) {
      id
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
        url
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
        url
        language {
          id
          displayName
        }
      } 
      units {
        id
        title 
        files {
          id
        }
        language {
          id
          locale
          displayName
        }
      }
    }
}
`;
