/**
 * mock data for UI development
 * eventually use for unit testing
 */
export const props = { id: 'test-123' };

export const mocks = [
  {
    request: {
      query: 'PRESS_PACKAGE_FORM_QUERY',
      variables: { id: props.id }
    },
    result: {
      data: {
        packageForm: {
          id: props.id,
          packageTitle: 'Final Guidance mm-dd-yy',
          packageType: 'Press Guidance'
        }
      }
    }
  }
];
