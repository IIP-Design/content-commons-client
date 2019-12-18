import { DOCUMENT_FILE_QUERY } from 'lib/graphql/queries/document';
import { mocks as pkgFiles } from '../mocks';

const documentFile = pkgFiles[0].result.data.pkg.documents[0];

export const props = {
  id: '1asd'
};

export const mocks = [
  {
    request: {
      query: DOCUMENT_FILE_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        documentFile
      }
    }
  }
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

export const undefinedDataMocks = [
  {
    ...mocks[0],
    result: {
      data: undefined
    }
  }
];
