import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import TableRow from './TableRow';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );

const myProjectsProps = {
  d: {
    id: 'd137',
    createdAt: '2019-05-09T18:33:03.368Z',
    updatedAt: '2019-05-09T18:33:03.368Z',
    team: 'IIP Video Production',
    author: 'Jane Doe',
    projectTitle: 'Test Title 1',
    status: 'PUBLISHED',
    visibility: 'INTERNAL',
    thumbnails: {
      url: 'https://thumbnailurl.com',
      alt: 'some alt text',
    },
    categories: 'about america'
  },
  selectedItems: new Map(),
  tableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'updatedAt', label: 'CREATED' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'author', label: 'AUTHOR' }
  ],
  toggleItemSelection: jest.fn(),
  projectTab: 'myProjects'
};

const teamProjectsProps = {
  ...myProjectsProps,
  projectTab: 'teamProjects'
};

const menuItems = [
  { name: 'team', label: 'TEAM' },
  { name: 'categories', label: 'CATEGORIES' },
  { name: 'updatedAt', label: 'MODIFIED DATE' }
];

const MyProjectsComponent = <TableRow { ...myProjectsProps } />;
const TeamProjectsComponent = <TableRow { ...teamProjectsProps } />;

describe( '<TableRow />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( MyProjectsComponent );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the persistent table headers if projectTab is myProjects', () => {
    const wrapper = shallow( MyProjectsComponent );
    const columns = wrapper.find( '.items_table_item' );
    const columnCount = columns.length;
    const expectedColumnCount = myProjectsProps.tableHeaders.length;

    expect( columnCount ).toEqual( expectedColumnCount );
    expect( toJSON( columns ) ).toMatchSnapshot();
  } );

  it( 'renders the persistent table headers if projectTab is teamProjects', () => {
    const wrapper = shallow( TeamProjectsComponent );
    const columns = wrapper.find( '.items_table_item' );
    const columnCount = columns.length;
    const expectedColumnCount = teamProjectsProps.tableHeaders.length;

    expect( columnCount ).toEqual( expectedColumnCount );
    expect( toJSON( columns ) ).toMatchSnapshot();
  } );

  it( 'renders Team, Categories, and Modified Date columns when selected', () => {
    const newProps = {
      ...myProjectsProps,
      tableHeaders: [
        ...myProjectsProps.tableHeaders,
        ...menuItems
      ]
    };

    const wrapper = shallow( <TableRow { ...newProps } /> );

    const columns = wrapper.find( '.items_table_item' );
    const columnCount = columns.length;
    const expectedColumnCount = newProps.tableHeaders.length;

    expect( columnCount ).toEqual( expectedColumnCount );
    expect( toJSON( columns ) ).toMatchSnapshot();
  } );

  it( 'renders null if myProjectsProps.d is falsy', () => {
    const newProps = { ...myProjectsProps, d: null };
    const wrapper = shallow( <TableRow { ...newProps } /> );

    expect( wrapper.html() ).toEqual( null );
  } );
} );
