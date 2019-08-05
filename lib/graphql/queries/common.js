import gql from 'graphql-tag';

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

export const PROJECT_STATUS_CHANGE_SUBSCRIPTION = gql`
  subscription PROJECT_STATUS_CHANGE_SUBSCRIPTION($id: ID!)  {
    projectStatusChange(id: $id) {
      id
      status
      error
    }
  }
`;
