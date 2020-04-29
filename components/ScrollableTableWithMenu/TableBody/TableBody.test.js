import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import TableBody from './TableBody';

/**
 * Use custom element to avoid "incorrect casing" error msg
 * @see https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 */
jest.mock( 'next/dynamic', () => () => 'my-project-primary-col' );

const props = {
  bodyPaginationVars: {
    first: 2,
    orderBy: 'createdAt_DESC',
    skip: 0
  },
  column: 'createdAt',
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
      __typename: 'Package'
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
      __typename: 'Package'
    }
  ],
  direction: 'descending',
  error: null,
  loading: false,
  projectTab: 'teamProjects',
  searchTerm: '',
  selectedItems: new Map(),
  tableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'updatedAt', label: 'MODIFIED' },
    { name: 'author', label: 'AUTHOR' }
  ],
  toggleItemSelection: jest.fn(),
  team: { contentTypes: ['VIDEO'] }
};

// Wrap TableBody in a table component to avoid warning message about invalid nesting of a <tbody>
const createTable = tableProps => (
  <table>
    <TableBody { ...tableProps } />
  </table>
);

describe( '<TableBody />', () => {
  it( 'renders initial loading state without crashing', () => {
    const newProps = { ...props, data: undefined, loading: true };

    const wrapper = mount( createTable( newProps ) );

    const message = wrapper.find( 'TableBodyMessage' );

    expect( message.exists() ).toEqual( true );
    expect( message.prop( 'type' ) ).toEqual( 'loading' );
  } );

  it( 'renders error message if an error is returned', () => {
    const newProps = { ...props, error: { message: 'There was an error.' } };

    const wrapper = mount( createTable( newProps ) );

    const message = wrapper.find( 'TableBodyMessage' );

    expect( message.exists() ).toEqual( true );
    expect( message.prop( 'type' ) ).toEqual( 'error' );
    // expect( errorComponent.contains( 'There was an error.' ) )
    // .toEqual( true );
  } );

  it( 'renders null if videoProjects or packages are null', () => {
    const newProps = { ...props, data: null };

    const wrapper = mount( createTable( newProps ) );

    const tableBody = wrapper.find( TableBody );

    expect( tableBody.html() ).toEqual( null );
  } );

  it( 'renders a no projects message if there are no projects', () => {
    const newProps = { ...props, data: [] };
    const wrapper = mount( createTable( newProps ) );

    const message = wrapper.find( 'TableBodyMessage' );

    expect( message.exists() ).toEqual( true );
    expect( message.prop( 'type' ) ).toEqual( 'no-projects' );
  } );

  it( 'renders a no results message if there are no search results', () => {
    const newProps = { ...props, data: [], searchTerm: 'new term' };

    const wrapper = mount( createTable( newProps ) );

    const message = wrapper.find( 'TableBodyMessage' );

    expect( message.exists() ).toEqual( true );
    expect( message.prop( 'type' ) ).toEqual( 'no-results' );
  } );

  it( 'renders the correct table row(s)', async() => {
    const wrapper = mount( createTable( props ) );

    const tableRows = wrapper.find( 'tr' );
    const rowCount = tableRows.length;

    const expectedRowCount = props.data.length;

    expect( rowCount ).toEqual( expectedRowCount );
    expect( toJSON( tableRows ) ).toMatchSnapshot();
  } );
} );
