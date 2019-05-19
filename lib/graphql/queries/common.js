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
