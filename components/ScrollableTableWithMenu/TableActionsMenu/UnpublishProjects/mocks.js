import { UNPUBLISH_VIDEO_PROJECT_MUTATION } from 'lib/graphql/queries/video';

export const mocks = [
  {
    id: 'cjx0j3ts9066y0708k1hg2g1b',
    createdAt: '2019-06-17T15:23:46.184Z',
    updatedAt: '2019-06-17T15:23:46.184Z',
    team: {
      id: 'cjrkzhvku000f0756l44blw33',
      name: 'IIP Video Production',
      organization: 'Department of State'
    },
    author: {
      id: 'cjrl1omfr002o075614zs8dxz',
      firstName: 'Edwin',
      lastName: 'Mah'
    },
    projectTitle: 'Philippines Village',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    thumbnails: [
      {
        id: 'cjx0j3xqz067z0708frd7sd9g',
        url: '2019/06/cjx0j3ts9066y0708k1hg2g1b/coverr-philippines-village-views-1559889358075.jpg',
        alt: null
      }
    ],
    categories: []
  },
  {
    id: 'cjx0sctfx06ry0708bmtuf37f',
    createdAt: '2019-06-17T19:42:42.188Z',
    updatedAt: '2019-06-17T19:42:42.188Z',
    team: {
      id: 'cjrkzhvku000f0756l44blw33',
      name: 'IIP Video Production',
      organization: 'Department of State'
    },
    author: {
      id: 'cjrl1omfr002o075614zs8dxz',
      firstName: 'Edwin',
      lastName: 'Mah'
    },
    projectTitle: 'Philippines Village 2',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    thumbnails: [
      {
        id: 'cjx0sd0yy06t30708by0b4suo',
        url: '2019/06/cjx0sctfx06ry0708bmtuf37f/coverr-philippines-village-views-1559889358075.jpg',
        alt: null
      }
    ],
    categories: []
  }
];

export const unpublishMocks = mocks.map( project => ( {
  request: {
    query: UNPUBLISH_VIDEO_PROJECT_MUTATION,
    variables: { id: project.id }
  },
  result: {
    data: {
      unpublishVideoProject: {
        __typename: 'VideoProject',
        id: project.id
      }
    }
  }
} ) );
