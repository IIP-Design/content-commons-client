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

export const DELETE_PACKAGE_MUTATION = gql`
  mutation DELETE_PACKAGE_MUTATION($id: ID!) {
    deletePackage(id: $id) {
      id
    }
  }
`;

export const DELETE_PACKAGES_MUTATION = gql`
  mutation DeleteManyPackages($where: PackageWhereInput) {
    deleteProjects: deleteManyPackages(where: $where) {
      count
    }
  }
`;

export const UNPUBLISH_PACKAGE_MUTATION = gql`
  mutation UNPUBLISH_PACKAGE_MUTATION($id: ID!) {
    unpublishPackage(id: $id) {
      id
    }
  }
`;

/*----------------------------------------
 Queries
 -----------------------------------------*/
export const TEAM_PACKAGES_QUERY = gql`
  query TeamPackagesQuery(
    $team: String!, $searchTerm: String
  ){
    packages(
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { title_contains: $searchTerm },
              { desc_contains: $searchTerm },
              {
                categories_some: {
                  translations_some: { name_contains: $searchTerm }
                }
              },
              {
                author: {
                  OR: [
                    { firstName_contains: $searchTerm },
                    { lastName_contains: $searchTerm },
                    { email_contains: $searchTerm }
                  ]
                }
              }
            ]
          }
        ]
      }
    ) {
      id
      createdAt
      updatedAt
      title
      team {
        id
        name
      }
      author {
        id
        firstName
        lastName
      }
      status
      visibility
      categories {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
      tags {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
    }
  }
`;

export const TEAM_PACKAGES_COUNT_QUERY = gql`
  query PackagesCountByTeam( $team: String!, $searchTerm: String ) {
    packages(
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { title_contains: $searchTerm },
              { desc_contains: $searchTerm },
              {
                categories_some: {
                  translations_some: { name_contains: $searchTerm }
                }
              },
              {
                author: {
                  OR: [
                    { firstName_contains: $searchTerm },
                    { lastName_contains: $searchTerm },
                    { email_contains: $searchTerm }
                  ]
                }
              }
            ]
          }
        ]
      }
    ) {
      id
    }
  }
`;

export const PACKAGE_DOCUMENTS_QUERY = gql`
  query PackageDocumentsQuery( $id: ID! ) {
    packageDocuments: package( id: $id ) {
      id
      documents {
        id
        filename
      }
    }
  }
`;
