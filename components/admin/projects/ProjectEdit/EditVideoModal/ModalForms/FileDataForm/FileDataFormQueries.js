import gql from 'graphql-tag';

export const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY( $id: ID! ) {
    project: videoProject( id: $id ) {
      id
      units {
        id
        language {
          id
          locale
        }
      }
    }
  }
`;

export const VIDEO_FILE_QUERY = gql`
  query VIDEO_FILE_QUERY( $id: ID! ) {
    file: videoFile( id: $id ) {
      id
      createdAt
      duration
      filename
      filesize
      quality
      videoBurnedInStatus
      dimensions {
        id
        height
        width
      }
      language {
        id
        displayName
      }
      stream {
        id
        site
        url
      }
      use {
        id
        name
      }
    }
  }
`;

export const VIDEO_FILE_LANG_MUTATION = gql`
  mutation VIDEO_FILE_LANG_MUTATION( $id: ID!, $language: ID! ) {
    updateVideoFile(
      data: {
        language: {
          connect: { id: $language }
        }
      },
      where: { id: $id }
    ) {
      id
      language { id }
    }
  }
`;

export const VIDEO_UNIT_CONNECT_FILE_MUTATION = gql`
  mutation VIDEO_UNIT_CONNECT_FILE_MUTATION( $id: ID!, $fileId: ID! ) {
    updateVideoUnit(
      data: {
        files: {
          connect: { id: $fileId }
        }
      },
      where: { id: $id }
    ) {
      id
      files { id }
    }
  }
`;

export const VIDEO_UNIT_DISCONNECT_FILE_MUTATION = gql`
  mutation VIDEO_UNIT_DISCONNECT_FILE_MUTATION( $id: ID!, $fileId: ID! ) {
    updateVideoUnit(
      data: {
        files: {
          disconnect: { id: $fileId }
        }
      },
      where: { id: $id }
    ) {
      id
      files { id }
    }
  }
`;

export const VIDEO_FILE_SUBTITLES_MUTATION = gql`
  mutation VIDEO_FILE_SUBTITLES_MUTATION( $id: ID!, $videoBurnedInStatus: VideoBurnedInStatus! ) {
    updateVideoFile(
      data: { videoBurnedInStatus: $videoBurnedInStatus },
      where: { id: $id }
    ) {
      id
      videoBurnedInStatus
    }
  }
`;

export const VIDEO_FILE_USE_MUTATION = gql`
  mutation VIDEO_FILE_USE_MUTATION( $id: ID!, $use: ID! ) {
    updateVideoFile(
      data: {
        use: {
          connect: { id: $use }
        }
      },
      where: { id: $id }
    ) {
      id
      use { id }
    }
  }
`;

export const VIDEO_FILE_QUALITY_MUTATION = gql`
  mutation VIDEO_FILE_QUALITY_MUTATION( $id: ID!, $quality: VideoQuality! ) {
    updateVideoFile(
      data: { quality: $quality },
      where: { id: $id }
    ) {
      id
      quality
    }
  }
`;

export const VIDEO_FILE_CREATE_STREAM_MUTATION = gql`
  mutation VIDEO_FILE_CREATE_STREAM_MUTATION( $id: ID!, $site: String!, $url: String! ) {
    updateVideoFile(
      data: { 
        stream: {
          create: {
            site: $site,
            url: $url
          }
        }
      },
      where: { id: $id }
    ) {
      id
      stream { id }
    }
  }
`;

export const VIDEO_FILE_UPDATE_STREAM_MUTATION = gql`
  mutation VIDEO_FILE_UPDATE_STREAM_MUTATION( $id: ID!, $streamId: ID! $url: String! ) {
    updateVideoFile(
      data: {
        stream: {
          update: {
            data: {
              url: $url
            },
            where: {
              id: $streamId
            }
          }
        }
      },
      where: { id: $id }
    ) {
      id
      stream { id }
    }
  }
`;

export const VIDEO_FILE_DELETE_STREAM_MUTATION = gql`
  mutation VIDEO_FILE_DELETE_STREAM_MUTATION( $id: ID!, $streamId: ID! ) {
    updateVideoFile(
      data: {
        stream: {
          delete: { id: $streamId }
        }
      },
      where: { id: $id }
    ) {
      id
      stream { id }
    }
  }
`;

export const VIDEO_FILE_DELETE_MUTATION = gql`
  mutation VIDEO_FILE_DELETE_MUTATION( $id: ID! ) {
    deleteVideoFile( id: $id ) {
      id
    }
  }
`;
