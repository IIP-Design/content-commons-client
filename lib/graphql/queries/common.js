import gql from 'graphql-tag';

/*----------------------------------------
  Subscriptions
 -----------------------------------------*/
export const PROJECT_STATUS_CHANGE_SUBSCRIPTION = gql`
 subscription PROJECT_STATUS_CHANGE_SUBSCRIPTION($id: ID!)  {
   projectStatusChange(id: $id) {
     id
     status
     error
   }
 }
`;


/*----------------------------------------
  Queries
 -----------------------------------------*/
// Fetches id of Thumbnail Use to verify file use type
export const IMAGE_USES_QUERY = gql`  
  query IMAGE_USES_QUERY {
    imageUses( where: {
      name_contains: "thumbnail"
    } ) {
      id
      name
    }
}
`;

/*----------------------------------------
  Mutations
 -----------------------------------------*/
export const UPDATE_SUPPORT_FILE_MUTATION = gql`
  mutation UPDATE_SUPPORT_FILE_MUTATION( $data: SupportFileUpdateInput!, $where:SupportFileWhereUniqueInput!) {
    updateSupportFile(data: $data, where: $where) {   
      id 
      filename
      language {
        id
        displayName
        locale
      } 
      use {
        id
        name
      }
    }
  } 
`;

export const UPDATE_IMAGE_FILE_MUTATION = gql`
  mutation UPDATE_IMAGE_FILE_MUTATION( $data: ImageFileUpdateInput!, $where:ImageFileWhereUniqueInput!) {
    updateImageFile(data: $data, where: $where) {   
      id 
      filename
      language {
        id
        displayName
        locale
      } 
      use {
        id
        name
      }
    }
  } 
`;

export const DELETE_SUPPORT_FILE_MUTATION = gql`
  mutation DELETE_SUPPORT_FILE_MUTATION($id: ID!) {
    deleteSupportFile(id: $id) {
      id
    }
  }
`;

export const DELETE_IMAGE_FILE_MUTATION = gql`
  mutation DELETE_IMAGE_FILE_MUTATION($id: ID!) {
    deleteImageFile(id: $id) {
      id
    }
  }
`;

export const DELETE_THUMBNAIL_MUTATION = gql`
  mutation DELETE_THUMBNAIL_MUTATION($id: ID!) {
    deleteThumbnail(id: $id) {
      id
    }
  }
`;

export const DELETE_MANY_THUMBNAILS_MUTATION = gql`
  mutation DELETE_MANY_THUMBNAILS_MUTATION($where: ThumbnailWhereInput!) {
    deleteManyThumbnails(where: $where) {
      count
    }
  }
`;
