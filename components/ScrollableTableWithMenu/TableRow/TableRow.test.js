import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { formatDate } from 'lib/utils';
import TableRow from './TableRow';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );
jest.mock( 'next-server/dynamic', () => () => 'ImageDetailsPopup' );

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
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'updatedAt', label: 'CREATED' },
    { name: 'team', label: 'TEAM' }
  ],
  toggleItemSelection: jest.fn()
};

const Component = <TableRow { ...props } />;

describe( '<TableRow />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the persistent table headers', () => {
    const wrapper = shallow( Component );
    const columns = wrapper.find( '.items_table_item' );
    const columnCount = columns.length;
    const expectedColumnCount = props.tableHeaders.length;

    expect( columnCount ).toEqual( expectedColumnCount );
    expect( toJSON( columns ) ).toMatchSnapshot();
    columns.forEach( ( column, i ) => {
      const { label } = props.tableHeaders[i];
      const name = props.d[props.tableHeaders[i].name];
      if ( i === 0 ) {
        expect( column.find( 'MyProjectPrimaryCol' ).exists() )
          .toEqual( true );
        expect( column.find( 'TableMobileDataToggleIcon' ).exists() )
          .toEqual( true );
      } else {
        expect( column.children().contains( label ) ).toEqual( true );
        expect( column.children().contains( name ) ).toEqual( true );
      }
    } );
  } );

  it( 'renders Author, Categories, and Modified Date columns when selected', () => {
    const additionalHeaders = [
      { name: 'author', label: 'AUTHOR' },
      { name: 'categories', label: 'CATEGORIES' },
      { name: 'createdAt', label: 'MODIFIED DATE' }
    ];

    const newProps = {
      ...props,
      tableHeaders: [
        ...props.tableHeaders,
        ...additionalHeaders
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
      if ( i === 0 ) {
        expect( column.find( 'MyProjectPrimaryCol' ).exists() )
          .toEqual( true );
        expect( column.find( 'TableMobileDataToggleIcon' ).exists() )
          .toEqual( true );
      } else {
        expect( column.children().contains( label ) ).toEqual( true );
        expect( column.children().contains( name ) ).toEqual( true );
      }
    } );
  } );

  it( 'renders null if props.d is falsy', () => {
    const newProps = { ...props, d: null };
    const wrapper = shallow( <TableRow { ...newProps } /> );

    expect( wrapper.html() ).toEqual( null );
  } );
} );
