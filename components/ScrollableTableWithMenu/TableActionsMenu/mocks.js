import { TEAM_VIDEO_PROJECTS_QUERY } from '../TableBody/TableBody';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from '../TablePagination/TablePagination';
import { DELETE_VIDEO_PROJECTS_MUTATION } from './DeleteProjects/DeleteProjects';
import { UNPUBLISH_VIDEO_PROJECTS_MUTATION } from './UnpublishProjects/UnpublishProjects';

export const props = {
  displayActionsMenu: true,
  variables: {
    team: 'IIP Video Production',
    searchTerm: '',
    first: 4,
    skip: 0
  },
  selectedItems: new Map( [['ud78', true], ['ud98', true]] ),
  handleResetSelections: jest.fn(),
  toggleAllItemsSelection: jest.fn()
};

export const mocks = [
  {
    request: {
      query: DELETE_VIDEO_PROJECTS_MUTATION,
      variables: {
        where: {
          AND: [
            { id_in: [...props.selectedItems.keys()] },
            { status_in: ['DRAFT', 'EMBARGOED'] }
          ]
        }
      }
    },
    result: {
      data: {
        deleteProjects: {
          count: [...props.selectedItems.keys()].length
        }
      }
    }
  },
  {
    request: {
      query: UNPUBLISH_VIDEO_PROJECTS_MUTATION,
      variables: {
        data: { status: 'DRAFT', visibility: 'INTERNAL' },
        where: {
          AND: [
            { id_in: [...props.selectedItems.keys()] },
            { status_not: 'DRAFT' }
          ]
        }
      }
    },
    result: {
      data: {
        unpublish: {
          count: [...props.selectedItems.keys()].length
        }
      }
    }
  },
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: {
        team: props.variables.team,
        searchTerm: props.variables.searchTerm
      }
    },
    result: {
      data: {
        videoProjects: [
          { id: 'ud78' },
          { id: 'ud98' },
          { id: 'ud64' },
          { id: 'ud23' },
          { id: 'ud74' }
        ]
      }
    }
  },
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: {
        team: props.variables.team,
        searchTerm: props.variables.searchTerm
      }
    },
    result: {
      data: {
        videoProjects: [
          { id: 'ud64' },
          { id: 'ud23' }
        ]
      }
    }
  },
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_QUERY,
      variables: { ...props.variables }
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
            id: 'ud98',
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
            id: 'ud64',
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
            id: 'ud23',
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
                      locale: 'en-us'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'ud74',
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
                      locale: 'en-us'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
];

export const errorMocks = [
  {
    ...mocks[4],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

export const nullMocks = [
  {
    ...mocks[4],
    result: {
      data: { videoProjects: null }
    }
  }
];

export const emptyMocks = [
  {
    ...mocks[4],
    result: {
      data: { videoProjects: [] }
    }
  }
];

export const allCheckedMocks = [
  {
    ...mocks[4],
    result: {
      data: {
        videoProjects: mocks[4].result.data.videoProjects
          .filter( project => project.id === 'ud78' || project.id === 'ud98' )
      }
    }
  }
];
