import { VIDEO_PROJECT_REVIEW_DATA_QUERY } from './VideoProjectData';

export const props = { id: '123' };

export const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_REVIEW_DATA_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          id: '123',
          projectTitle: 'test title',
          author: {
            id: 'au438',
            firstName: 'Jane',
            lastName: 'Doe'
          },
          team: {
            id: 't11',
            name: 'IIP Video Production'
          },
          visibility: 'PUBLIC',
          descPublic: 'The public description',
          descInternal: 'The internal description',
          categories: [
            {
              id: 'c77',
              translations: [
                {
                  id: 'ct7',
                  name: 'about america'
                },
                {
                  id: 'ct8',
                  name: 'Amérique'
                }
              ]
            }
          ],
          tags: [
            {
              id: 't44',
              translations: [
                {
                  id: 'tt4',
                  name: 'american culture'
                },
                {
                  id: 'tt5',
                  name: 'Culture américaine'
                }
              ]
            }
          ]
        }
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

export const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { project: null }
    }
  }
];

export const nullCatTagsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          categories: null,
          tags: null
        }
      }
    }
  }
];

export const emptyCatTagsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          categories: [],
          tags: []
        }
      }
    }
  }
];

export const nullAuthorTeamMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          author: null,
          team: null
        }
      }
    }
  }
];

export const emptyAuthorTeamMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          author: {},
          team: {}
        }
      }
    }
  }
];
