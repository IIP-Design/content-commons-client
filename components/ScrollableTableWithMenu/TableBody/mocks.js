import { TEAM_VIDEO_PROJECTS_QUERY } from 'components/ScrollableTableWithMenu/TableBody/TableBody';
import { PROJECT_STATUS_CHANGE_SUBSCRIPTION } from 'lib/graphql/queries/common';

export const videoProjects = [
  {
    id: 'd137',
    createdAt: '2019-05-09T18:33:03.368Z',
    updatedAt: '2019-05-09T18:33:03.368Z',
    team: {
      id: 't888',
      name: 'IIP Video Production',
      organization: 'Department of State'
    },
    author: {
      id: 'a928',
      firstName: 'Jane',
      lastName: 'Doe'
    },
    projectTitle: 'Test Title 1',
    status: 'PUBLISHED',
    visibility: 'INTERNAL',
    thumbnails: {
      id: 't34',
      url: 'https://thumbnailurl.com',
      signedUrl: 'https://thumbnailurl.com',
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
              locale: 'en-us'
            }
          }
        ]
      }
    ]
  },
  {
    id: 'z132',
    createdAt: '2019-05-12T18:33:03.368Z',
    updatedAt: '2019-05-12T18:33:03.368Z',
    team: {
      id: 't888',
      name: 'IIP Video Production',
      organization: 'Department of State'
    },
    author: {
      id: 'a287',
      firstName: 'Joe',
      lastName: 'Schmoe'
    },
    projectTitle: 'Test Title 2',
    status: 'PUBLISHED',
    visibility: 'INTERNAL',
    thumbnails: {
      id: 't34',
      url: 'https://thumbnailurl.com',
      signedUrl: 'https://thumbnailurl.com',
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
              locale: 'en-us'
            }
          }
        ]
      }
    ]
  }
];

export const videoProjectIds = videoProjects.map( p => p.id );

export const propVariables = {
  team: 'IIP Video Production',
  searchTerm: '',
  first: 4,
  skip: 0
};

export const mocks = [
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_QUERY,
      variables: { ...propVariables }
    },
    result: {
      data: { videoProjects },
      subscribeToStatuses: jest.fn()
    }
  },
  {
    request: {
      query: PROJECT_STATUS_CHANGE_SUBSCRIPTION,
      variables: { ids: videoProjectIds }
    },
    result: {
      data: {
        projectStatusChange: {
          id: 'd137',
          status: 'DRAFT',
          error: null
        }
      }
    }
  }
];
