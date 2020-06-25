import { TEAMS_QUERY } from './TeamDropdown';

export const mocks = [
  {
    request: {
      query: TEAMS_QUERY,
    },
    result: {
      data: {
        teams: [
          {
            id: 'ck2lzfx640hig0720fw7j98yt',
            name: 'GPA Video',
            organization: 'Department of State',
            contentTypes: ['VIDEO'],
          },
          {
            id: 'ck2lzfx650hih0720mpgplsqr',
            name: 'U.S. Speakers Program',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2lzfx6f0hk607209lofxuzd',
            name: 'American Spaces',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2lzfx6f0hk707205r3a5xwk',
            name: 'GPA Media Strategy',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2lzfx6p0hkd0720h05lurvx',
            name: 'ShareAmerica',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2lzfx6p0hke0720t6zw8jde',
            name: 'YLAI',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2lzfx6r0hkg07201iym6ckg',
            name: 'ECA',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2lzfx6u0hkj0720f8n8mtda',
            name: 'GPA Editorial & Design',
            organization: 'Department of State',
            contentTypes: ['GRAPHIC'],
          },
          {
            id: 'ck2lzfx6w0hkk07205vkfqtdk',
            name: 'VOA Editorials',
            organization: 'Agency for Global Media',
            contentTypes: [],
          },
          {
            id: 'ck2lzfx710hkn0720tog9i53x',
            name: 'Global Engagement Center',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2qgfbke0ubc07209xmmjua2',
            name: 'GPA Front Office',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2qgfbku0ubh0720iwhkvuyn',
            name: 'GPA Press Office',
            organization: 'Department of State',
            contentTypes: ['PACKAGE'],
          },
          {
            id: 'ck5cvpjdf01kq0720i4ovjo49',
            name: 'U.S. Missions',
            organization: 'Department of State',
            contentTypes: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: TEAMS_QUERY,
      variables: {
        where: {
          name_in: [
            'GPA Editorial & Design',
            'ShareAmerica',
          ],
        },
      },
    },
    result: {
      data: {
        teams: [
          {
            id: 'ck2lzfx6p0hkd0720h05lurvx',
            name: 'ShareAmerica',
            organization: 'Department of State',
            contentTypes: [],
          },
          {
            id: 'ck2lzfx6u0hkj0720f8n8mtda',
            name: 'GPA Editorial & Design',
            organization: 'Department of State',
            contentTypes: ['GRAPHIC'],
          },
        ],
      },
    },
  },
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
  {
    ...mocks[1],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
];

export const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { teams: null },
    },
  },
  {
    ...mocks[1],
    result: {
      data: { teams: null },
    },
  },
];

export const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { teams: [] },
    },
  },
  {
    ...mocks[1],
    result: {
      data: { teams: [] },
    },
  },
];
