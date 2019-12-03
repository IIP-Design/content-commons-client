import gql from 'graphql-tag';

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
        id
        language { id languageCode locale textDirection displayName nativeName }
        filetype
        filename
        filesize
        status
        content {
          id
          rawText
          html
          markdown
        }
        image {
          id
          language { id languageCode locale textDirection displayName nativeName }
          dimensions {
            height
            width
          }
          alt
          longdesc
          caption
          filename
          filetype
          visibility
          use {
            id
            name
          }
          md5
          url
          signedUrl
        }
        url
        signedUrl
        visibility
        use {
          id
          name
        }
        tags {
          id 
          translations {
            name
            language { id languageCode locale textDirection displayName nativeName }
          }
        }
        bureaus {
          id
          name
          abbr
          offices {
            id
            name
            abbr
          }
        }
        categories {
          id 
          translations {
            name
            language { id languageCode locale textDirection displayName nativeName }
          }
        }
      }
    }
  }
  ${PACKAGE_DETAILS_FRAGMENT}
`;
