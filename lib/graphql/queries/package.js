import gql from 'graphql-tag';
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
    }
  }
`;

export const UPDATE_PACKAGE_MUTATION = gql`
  mutation UPDATE_PACKAGE_MUTATION(
    $data: PackageUpdateInput!
    $where: PackageWhereUniqueInput!
  ) {
    updatePackage(data: $data, where: $where) {
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
    package(id: $id) {
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
      documents {
        ...documentDetails
      }
    }
  }
  ${DOCUMENT_DETAILS_FRAGMENT}
`;
