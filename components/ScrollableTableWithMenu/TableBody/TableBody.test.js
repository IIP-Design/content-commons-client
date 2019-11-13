import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Loader, Table } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import TableBody, {
  TEAM_VIDEO_PROJECTS_QUERY, updateProjectStatus, teamProjectsQuery, TableBodyRaw
} from './TableBody';
import { videoProjects, mocks } from './mocks';

/**
 * Use custom element to avoid "incorrect casing" error msg
 * @see https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 */
// jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );
jest.mock( 'next-server/dynamic', () => () => 'video-details-popup' );

// Mock DetailsPopup component since it's tested elsewhere
jest.mock( 'components/admin/Dashboard/TeamProjects/DetailsPopup/DetailsPopup', () => () => 'DetailsPopup' );

const videoProjectIds = videoProjects.map( p => p.id );

const props = {
  searchTerm: '',
  selectedItems: new Map(),
  tableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'updatedAt', label: 'MODIFIED' },
    { name: 'team', label: 'TEAM' }
  ],
  toggleItemSelection: jest.fn(),
  variables: {
    team: 'IIP Video Production',
    searchTerm: '',
    first: 4,
    skip: 0
  },
  direction: 'descending',
  projectTab: 'teamProjects',
  videoProjectIds
};

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <Table>
      <TableBody { ...props } />
    </Table>
  </MockedProvider>
);

describe( '<TableBody />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const tableBody = wrapper.find( TableBody );
    const loader = <Loader active inline size="small" />;

    expect( tableBody.exists() ).toEqual( true );
    expect( tableBody.contains( loader ) ).toEqual( true );
    expect( tableBody.contains( 'Loading...' ) ).toEqual( true );
  } );

  it( 'renders error message if an error is returned', async () => {
    const errorMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_QUERY,
          variables: { ...props.variables }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <Table>
          <TableBody { ...props } />
        </Table>
      </MockedProvider>
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const tableBody = wrapper.find( TableBody );
    const errorComponent = tableBody.find( ApolloError );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders null if videoProjects is null', async () => {
    const nullMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: { videoProjects: null }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <Table>
          <TableBody { ...props } />
        </Table>
      </MockedProvider>
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const tableBody = wrapper.find( TableBody );

    expect( tableBody.html() ).toEqual( null );
  } );

  it( 'renders a "No projects" message if there are no video projects', async () => {
    const emptyMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: { videoProjects: [] }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptyMocks } addTypename={ false }>
        <Table>
          <TableBody { ...props } />
        </Table>
      </MockedProvider>
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const tableBody = wrapper.find( TableBody );

    expect( tableBody.contains( 'No projects' ) ).toEqual( true );
  } );

  it( 'renders a "No results" message if there are no search results', async () => {
    const newSearchTerm = 'new term';

    const newProps = {
      ...{ ...props },
      ...{
        searchTerm: newSearchTerm,
        variables: {
          ...props.variables,
          searchTerm: newSearchTerm
        }
      }
    };

    const noSearchResultsMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_QUERY,
          variables: { ...newProps.variables }
        },
        result: {
          data: { videoProjects: [] }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ noSearchResultsMocks } addTypename={ false }>
        <Table>
          <TableBody { ...newProps } />
        </Table>
      </MockedProvider>
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const tableBody = wrapper.find( TableBody );
    const noResultsMsg = (
      <Table.Cell>
        No results for &ldquo;{ newProps.searchTerm }&rdquo;
      </Table.Cell>
    );

    expect( tableBody.contains( noResultsMsg ) ).toEqual( true );
  } );

  it( 'renders the correct table row(s)', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const tableBody = wrapper.find( TableBody );
    const tableRows = tableBody.find( 'tr' );
    const rowCount = tableRows.length;
    const expectedRowCount = mocks[0].result.data.videoProjects.length;

    expect( rowCount ).toEqual( expectedRowCount );
    expect( toJSON( tableRows ) ).toMatchSnapshot();
  } );

  it( 'subscribes to status updates', async () => {
    const spy = jest.fn();
    const TableBodyMock = teamProjectsQuery( wrapProps => (
      <TableBodyRaw { ...wrapProps } subscribeToStatuses={ spy } />
    ) );
    const Comp = (
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <Table>
          <TableBodyMock { ...props } />
        </Table>
      </MockedProvider>
    );
    const wrapper = mount( Comp );
    await wait( 0 );
    wrapper.update();
    expect( spy ).toHaveBeenCalled();
  } );

  describe( 'updateProjectStatus', () => {
    it( 'updates the correct project', () => {
      const subscriptionData = { ...mocks[1].result };
      const result = updateProjectStatus( { videoProjects }, { subscriptionData } );
      const expected = { videoProjects: [{ ...videoProjects[0], status: 'DRAFT' }, { ...videoProjects[1] }] };
      expect( result ).toEqual( expected );
    } );

    it( 'does not update anything for null data', () => {
      const subscriptionData = { data: { projectStatusChange: null } };
      const result = updateProjectStatus( { videoProjects }, { subscriptionData } );
      const expected = { videoProjects };
      expect( result ).toEqual( expected );
    } );

    it( 'does not update anything for a non existent project ID', () => {
      const subscriptionData = { ...mocks[1].result };
      subscriptionData.data.projectStatusChange.id = 'xxxx';
      const result = updateProjectStatus( { videoProjects }, { subscriptionData } );
      const expected = { videoProjects };
      expect( result ).toEqual( expected );
    } );
  } );
} );
