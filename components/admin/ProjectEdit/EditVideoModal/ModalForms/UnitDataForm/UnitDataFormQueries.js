import { gql } from '@apollo/client';

export const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY($unitId: ID!) {
    unit: videoUnit(id: $unitId) {
      id
      title
      descPublic
      language {
        id
        displayName
        locale
        textDirection
      }
      tags {
        id
      }
      thumbnails {
        id
        image {
          id
          alt
          url
          signedUrl
        }
      }
    }
  }
`;

export const VIDEO_FILE_QUERY = gql`
  query VIDEO_FILE_QUERY($id: ID!) {
    file: videoFile(id: $id) {
      id
      stream {
        id
        site
        url
      }
    }
  }
`;

export const VIDEO_UNIT_TITLE_MUTATION = gql`
  mutation VIDEO_UNIT_TITLE_MUTATION($id: ID!, $title: String) {
    updateVideoUnit(data: { title: $title }, where: { id: $id }) {
      id
      title
    }
  }
`;

export const VIDEO_UNIT_DESC_MUTATION = gql`
  mutation VIDEO_UNIT_DESC_MUTATION($id: ID!, $descPublic: String) {
    updateVideoUnit(data: { descPublic: $descPublic }, where: { id: $id }) {
      id
      descPublic
    }
  }
`;

export const VIDEO_UNIT_REMOVE_TAG_MUTATION = gql`
  mutation VIDEO_UNIT_REMOVE_TAG_MUTATION($id: ID!, $tagId: ID!) {
    updateVideoUnit(
      data: { tags: { disconnect: { id: $tagId } } }
      where: { id: $id }
    ) {
      id
      tags {
        id
      }
    }
  }
`;
