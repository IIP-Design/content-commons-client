import gql from 'graphql-tag';
import { IMAGE_DETAILS_FRAGMENT, LANGUAGE_DETAILS_FRAGMENT } from './common';

/*----------------------------------------
 Fragments
 -----------------------------------------*/
export const DOCUMENT_DETAILS_FRAGMENT = gql`
  fragment documentDetails on DocumentFile {
    id
    language {
      ...languageDetails
    }
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
      ...imageDetails
    }
    url
    # signedUrl
    visibility
    use {
      id
      name
    }
    tags {
      id 
      translations {
        name
        language {
          ...languageDetails
        }
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
        language {
          ...languageDetails
        }
      }
    }
  }
  ${LANGUAGE_DETAILS_FRAGMENT}
  ${IMAGE_DETAILS_FRAGMENT}
`;

/*----------------------------------------
 Mutations
 -----------------------------------------*/


/*----------------------------------------
 Queries
 -----------------------------------------*/
export const DOCUMENT_FILE_QUERY = gql`
  query DocumentFile($id: ID!) {
    documentFile(id: $id) {
      id
      filename
      image {
        ...imageDetails
      }
    }
  }
  ${IMAGE_DETAILS_FRAGMENT}
`;
