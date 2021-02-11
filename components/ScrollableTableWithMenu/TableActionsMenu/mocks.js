// import { TEAM_VIDEO_PROJECTS_QUERY } from '../TableBody/TableBody';
// import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from '../TablePagination/TablePagination';

export const props = {
  data: [
    {
      author: 'Marek',
      categories: '',
      createdAt: '2020-04-22T13:22:08.848Z',
      id: 'ck9bd9hsh06bc07882icvx8e0',
      projectTitle: 'Guidance Package 04-22-20',
      status: 'PUBLISHED',
      team: 'GPA Press Office',
      thumbnail: {},
      updatedAt: '2020-04-22T13:22:42.672Z',
      visibility: 'INTERNAL',
      __typename: 'Package',
    },
    {
      author: 'Marek',
      categories: '',
      createdAt: '2020-04-20T16:30:48.298Z',
      id: 'ck98p4elp02i20788l3lxq5gt',
      projectTitle: 'Guidance Package 04-20-20',
      status: 'PUBLISHED',
      team: 'GPA Press Office',
      thumbnail: {},
      updatedAt: '2020-04-20T16:31:14.936Z',
      visibility: 'INTERNAL',
      __typename: 'Package',
    },
  ],
  error: null,
  handleResetSelections: jest.fn(),
  refetch: jest.fn(),
  refetchCount: jest.fn(),
  loading: false,
  toggleAllItemsSelection: jest.fn(),
  variables: {
    team: 'IIP Video Production',
    searchTerm: '',
    first: 4,
    skip: 0,
  },
};

export const mocks = [
  {
    request: {
      // query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: {
        team: props.variables.team,
        searchTerm: props.variables.searchTerm,
      },
    },
    result: {
      data: {
        videoProjects: [
          { id: 'ud78' },
          { id: 'ud98' },
          { id: 'ud64' },
          { id: 'ud23' },
          { id: 'ud74' },
        ],
      },
    },
  },
  {
    request: {
      // query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: {
        team: props.variables.team,
        searchTerm: props.variables.searchTerm,
      },
    },
    result: {
      data: {
        videoProjects: [
          { id: 'ud64' },
          { id: 'ud23' },
        ],
      },
    },
  },
  {
    request: {
      // query: TEAM_VIDEO_PROJECTS_QUERY,
      variables: { ...props.variables },
    },
    result: {
      data: {
        videoProjects: [
          {
            id: 'ud78',
            createdAt: '2019-05-09T18:33:03.368Z',
            updatedAt: '2019-05-09T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a928',
              firstName: 'Jane',
              lastName: 'Doe',
            },
            projectTitle: 'Test Title 1',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'ud98',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe',
            },
            projectTitle: 'Test Title 2',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'ud64',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe',
            },
            projectTitle: 'Test Title 2',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'ud23',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe',
            },
            projectTitle: 'Test Title 2',
            status: 'DRAFT',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'ud74',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe',
            },
            projectTitle: 'Test Title 2',
            status: 'DRAFT',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      // query: TEAM_VIDEO_PROJECTS_QUERY,
      variables: { ...props.variables },
    },
    result: {
      data: {
        videoProjects: [
          {
            id: 'ud78',
            createdAt: '2019-05-09T18:33:03.368Z',
            updatedAt: '2019-05-09T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a928',
              firstName: 'Jane',
              lastName: 'Doe',
            },
            projectTitle: 'Test Title 1',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'ud98',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe',
            },
            projectTitle: 'Test Title 2',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'ud64',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe',
            },
            projectTitle: 'Test Title 2',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'ud74',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State',
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe',
            },
            projectTitle: 'Test Title 2',
            status: 'DRAFT',
            visibility: 'INTERNAL',
            thumbnails: {
              id: 't34',
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      id: 'en23',
                      locale: 'en-us',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
];

export const errorMocks = [
  {
    ...mocks[2],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
];

export const nullMocks = [
  {
    ...mocks[2],
    result: {
      data: { videoProjects: null },
    },
  },
];

export const emptyMocks = [
  {
    ...mocks[2],
    result: {
      data: { videoProjects: [] },
    },
  },
];

export const allCheckedMocks = [
  {
    ...mocks[2],
    result: {
      data: {
        videoProjects: mocks[2].result.data.videoProjects
          .filter( project => project.id === 'ud78' || project.id === 'ud98' ),
      },
    },
  },
];

export const actionResult = {
  error: 'Error message',
  action: 'delete',
  project: {
    id: '123abc',
    projectTitle: 'Title',
  },
};
