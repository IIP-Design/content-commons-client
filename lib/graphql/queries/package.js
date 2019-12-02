import gql from 'graphql-tag';

/*----------------------------------------
 Fragments
 -----------------------------------------*/


/*----------------------------------------
 Mutations
 -----------------------------------------*/
export const CREATE_PACKAGE_MUTATION = gql`
  mutation CREATE_PACKAGE_MUTATION($data: PackageCreateInput!) {
    createPackage(data: $data) {
      id 
    }
  }
`;

/*----------------------------------------
 Queries
 -----------------------------------------*/
