import { PACKAGE_QUERY, DELETE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';

export const props = {
  id: 'test-123',
  router: { query: { id: 'test-123' } }
};

export const mocks = [
  {
    request: {
      query: PACKAGE_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        package: {
          __typename: 'Package',
          id: props.id,
          publishedAt: '',
          type: 'DAILY_GUIDANCE',
          title: 'Final Guidance mm-dd-yy'
        }
      }
    }
  },
  {
    request: {
      query: DELETE_PACKAGE_MUTATION,
      variables: { id: props.id }
    },
    result: {
      data: {
        deletePackage: {
          __typename: 'Package',
          id: props.id
        }
      }
    }
  },
  // {
  //   request: {
  //     query: 'UPDATE_PACKAGE_MUTATION',
  //     variables: {
  //       data: { title: 'New Title' },
  //       where: { id: props.id }
  //     }
  //   },
  //   result: {
  //     data: {
  //       updatePackage: {
  //         __typename: 'Package',
  //         id: props.id,
  //         title: 'New Title'
  //       }
  //     }
  //   }
  // }
];

export const publishedMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        package: {
          ...mocks[0].result.data.package,
          publishedAt: '2019-11-13T13:08:28.830Z'
        }
      }
    }
  },
  {
    request: {
      query: 'DELETE_PACKAGE_MUTATION',
      variables: { id: props.id }
    },
    result: {
      data: {
        deletePackage: {
          __typename: 'Package',
          id: props.id
        }
      }
    }
  },
  {
    request: {
      query: 'UPDATE_PACKAGE_MUTATION',
      variables: {
        data: { title: 'New Title' },
        where: { id: props.id }
      }
    },
    result: {
      data: {
        updatePackage: {
          __typename: 'Package',
          id: props.id,
          title: 'New Title'
        }
      }
    }
  }
];
