import { gql } from '@apollo/client';
import { DOCUMENT_DETAILS_FRAGMENT } from './document';

/*----------------------------------------
 Fragments
 -----------------------------------------*/
export const PACKAGE_DETAILS_FRAGMENT = gql`
  fragment packageDetails on Package {
    id
    createdAt
    updatedAt
    publishedAt
    type
    assetPath
    author {
      id
      firstName
      lastName
    }
    team {
      id
      name
    }
    title
    desc
    status
    visibility
    categories {
      id
      translations(
        where: { language: { locale: "en-us" } }
        orderBy: name_ASC
      ) {
        id
        name
      }
    }
    tags {
      id
      translations(
        where: { language: { locale: "en-us" } }
        orderBy: name_ASC
      ) {
        id
        name
      }
    }
  }
`;

/*----------------------------------------
 Mutations
 -----------------------------------------*/
export const CREATE_PACKAGE_MUTATION = gql`
  mutation CREATE_PACKAGE_MUTATION($data: PackageCreateInput!) {
    createPackage(data: $data) {
      id 
      assetPath
    }
  }
`;

// Return complete tree to enable auto cache update
export const UPDATE_PACKAGE_MUTATION = gql`
  mutation UPDATE_PACKAGE_MUTATION(
    $data: PackageUpdateInput!
    $where: PackageWhereUniqueInput!
  ) {
    # return all data to trigger auto cache update
    updatePackage(data: $data, where: $where) {  
      ...packageDetails
      documents {
      ...documentDetails
      }
    } 
  }
  ${PACKAGE_DETAILS_FRAGMENT}
  ${DOCUMENT_DETAILS_FRAGMENT}
`;

export const UPDATE_PACKAGE_STATUS_MUTATION = gql`
  mutation UPDATE_PACKAGE_STATUS_MUTATION( 
    $data: PackageUpdateInput!
    $where: PackageWhereUniqueInput!
  ) {
      updatePackage(data: $data, where: $where) {  
        id
        title
        updatedAt
        publishedAt
        status
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

export const PUBLISH_PACKAGE_MUTATION = gql`
  mutation PUBLISH_PACKAGE_MUTATION($id: ID!) {
    publishPackage(id: $id) {
      id
      status
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
export const PACKAGE_EXISTS_QUERY = gql`
  mutation PACKAGE_EXISTS_QUERY($where: PackageWhereInput!) {
    packageExists(where: $where)
  }
`;

export const PACKAGE_QUERY = gql`
  query Package($id: ID!) {
    pkg: package(id: $id) {
      ...packageDetails
      documents {
        ...documentDetails
      }
    }
  }
  ${PACKAGE_DETAILS_FRAGMENT}
  ${DOCUMENT_DETAILS_FRAGMENT}
`;

export const PACKAGE_DETAILS_QUERY = gql`
  query Package($id: ID!) {
    pkg: package(id: $id) {
      ...packageDetails
    }
  }
  ${PACKAGE_DETAILS_FRAGMENT}
`;

export const PACKAGE_FILES_QUERY = gql`
  query Package($id: ID!) {
    pkg: package(id: $id) {
      id
      title
      type
      assetPath
      documents(orderBy: updatedAt_DESC) {
        ...documentDetails
      }
    }
  }
  ${DOCUMENT_DETAILS_FRAGMENT}
`;


export const TEAM_PACKAGES_QUERY = gql`
  query TeamPackagesQuery(
    $team: TeamWhereInput!,
    $searchTerm: String,
    $first: Int,
    $skip: Int,
    $orderBy: PackageOrderByInput
  ){
    packages(
      first: $first,
      skip: $skip,
      orderBy: $orderBy,
      where: {
        AND: [
          { team: $team  },
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
      ...packageDetails
    }
  }
  ${PACKAGE_DETAILS_FRAGMENT}
`;

export const PACKAGES_META_QUERY = gql`
  query PackagesMeta {
    packages {
      id
      publishedAt
      status
    }
  }
`;

export const TEAM_PACKAGES_COUNT_QUERY = gql`
  query PackagesCountByTeam( $team: TeamWhereInput!, $searchTerm: String ) {
    packages(
      where: {
        AND: [
          { team: $team },
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
