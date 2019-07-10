import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { formatDate } from 'lib/utils';
import TableRow from './TableRow';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );

const props = {
  d: {
    id: 'd137',
    createdAt: formatDate( '2019-05-09T18:33:03.368Z' ),
    updatedAt: formatDate( '2019-05-09T18:33:03.368Z' ),
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

const menuItems = [
  { name: 'team', label: 'TEAM' },
  { name: 'categories', label: 'CATEGORIES' },
  { name: 'updatedAt', label: 'MODIFIED DATE' }
];

const Component = <TableRow { ...props } />;

describe( '<TableRow />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the persistent table headers if projectTab is myProjects', () => {
    const wrapper = shallow( Component );
    const columns = wrapper.find( '.items_table_item' );
    const columnCount = columns.length;
    const expectedColumnCount = props.tableHeaders.length;

    expect( columnCount ).toEqual( expectedColumnCount );
    expect( toJSON( columns ) ).toMatchSnapshot();
    columns.forEach( ( column, i ) => {
      const { label } = props.tableHeaders[i];
      const name = props.d[props.tableHeaders[i].name];
      const primaryCol = column.find( '.primary_col' );
      const videoPopup = column.find( 'VideoDetailsPopup' );
      const mobileToggle = column.find( 'TableMobileDataToggleIcon' );

      expect( column.find( `[data-header="${label}"]` ).exists() )
        .toEqual( true );

      if ( i === 0 && props.projectTab === 'myProjects' ) {
        expect( primaryCol.exists() ).toEqual( true );
        expect( videoPopup.exists() ).toEqual( true );
        expect( mobileToggle.exists() ).toEqual( true );
      } else {
        expect( column.contains( label ) ).toEqual( true );
        expect( column.contains( name ) ).toEqual( true );
      }
    } );
  } );

  it( 'renders the persistent table headers if projectTab is teamProjects', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { projectTab: 'teamProjects' } );
    const columns = wrapper.find( '.items_table_item' );
    const columnCount = columns.length;
    const expectedColumnCount = props.tableHeaders.length;

    expect( columnCount ).toEqual( expectedColumnCount );
    expect( toJSON( columns ) ).toMatchSnapshot();
    columns.forEach( ( column, i ) => {
      const { label } = props.tableHeaders[i];
      const name = props.d[props.tableHeaders[i].name];
      const primaryCol = column.find( '.primary_col' );
      const videoPopup = column.find( 'VideoDetailsPopup' );
      const mobileToggle = column.find( 'TableMobileDataToggleIcon' );

      expect( column.find( `[data-header="${label}"]` ).exists() )
        .toEqual( true );

      if ( i === 0 && props.projectTab === 'myProjects' ) {
        expect( primaryCol.exists() ).toEqual( true );
        expect( videoPopup.exists() ).toEqual( true );
        expect( mobileToggle.exists() ).toEqual( true );
      } else {
        expect( column.contains( label ) ).toEqual( true );
        expect( column.contains( name ) ).toEqual( true );
      }
    } );
  } );

  it( 'renders Team, Categories, and Modified Date columns when selected', () => {
    const newProps = {
      ...props,
      tableHeaders: [
        ...props.tableHeaders,
        ...menuItems
      ]
    };

    const wrapper = shallow( <TableRow { ...newProps } /> );

    const columns = wrapper.find( '.items_table_item' );
    const columnCount = columns.length;
    const expectedColumnCount = newProps.tableHeaders.length;

    expect( columnCount ).toEqual( expectedColumnCount );
    expect( toJSON( columns ) ).toMatchSnapshot();
    columns.forEach( ( column, i ) => {
      const { label } = newProps.tableHeaders[i];
      const name = newProps.d[newProps.tableHeaders[i].name];
      const primaryCol = column.find( '.primary_col' );
      const videoPopup = column.find( 'VideoDetailsPopup' );
      const mobileToggle = column.find( 'TableMobileDataToggleIcon' );

      expect( column.find( `[data-header="${label}"]` ).exists() )
        .toEqual( true );

      if ( i === 0 && props.projectTab === 'myProjects' ) {
        expect( primaryCol.exists() ).toEqual( true );
        expect( videoPopup.exists() ).toEqual( true );
        expect( mobileToggle.exists() ).toEqual( true );
      } else {
        expect( column.contains( label ) ).toEqual( true );
        expect( column.contains( name ) ).toEqual( true );
      }
    } );
  } );

  it( 'renders null if props.d is falsy', () => {
    const newProps = { ...props, d: null };
    const wrapper = shallow( <TableRow { ...newProps } /> );

    expect( wrapper.html() ).toEqual( null );
  } );
} );
