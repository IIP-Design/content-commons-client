import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { Loader, Table } from 'semantic-ui-react';
import { TEAM_VIDEO_PROJECTS_QUERY } from 'lib/graphql/queries/video';
import { TEAM_PACKAGES_QUERY } from 'lib/graphql/queries/package';
import TableBody, { updateProjectStatus } from './TableBody';
import { videoProjects, mocks } from './mocks';

/**
 * Use custom element to avoid "incorrect casing" error msg
 * @see https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 */
// jest.mock( 'next/dynamic', () => () => 'VideoDetailsPopup' );
jest.mock( 'next/dynamic', () => () => 'video-details-popup' );

// Mock DetailsPopup component since it's tested elsewhere
jest.mock( 'components/admin/Dashboard/TeamProjects/DetailsPopup/DetailsPopup', () => () => 'DetailsPopup' );

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
    team: 'GPA Video',
    searchTerm: '',
    first: 4,
    skip: 0
  },
  direction: 'descending',
  projectTab: 'teamProjects',
  team: {
    contentTypes: [
      'VIDEO', 
      // 'PACKAGE'
    ]
  }
};

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <Table>
      <TableBody { ...props } />
    </Table>
  </MockedProvider>
);

describe( '<TableBody />', () => {
  /**
   * @todo Suppress React 16.8 `act()` warnings globally.
   * The React team's fix won't be out of alpha until 16.9.0.
   * @see https://github.com/facebook/react/issues/14769
   */
  const consoleError = console.error;
  beforeAll( () => {
    const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';
    jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
      if ( !args[0].includes( actMsg ) ) {
        consoleError( ...args );
      }
    } );
  } );

  afterAll( () => {
    // restore console.error
    console.error = consoleError;
  } );

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
      },
      {
        request: {
          query: TEAM_PACKAGES_QUERY,
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
    const errorComponent = tableBody.find( 'TableBodyError ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders null if videoProjects or packages are null', async () => {
    const nullMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: { videoProjects: null }
        }
      },
      {
        request: {
          query: TEAM_PACKAGES_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: { packages: null }
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

  it( 'renders a "No projects" message if there are no video or package projects', async () => {
    const emptyMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: { videoProjects: [] }
        }
      },
      {
        request: {
          query: TEAM_PACKAGES_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: { packages: [] }
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
      },
      {
        request: {
          query: TEAM_PACKAGES_QUERY,
          variables: { ...newProps.variables }
        },
        result: {
          data: { packages: [] }
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
    
    /**
     * Used w/ packages b/c of typename error
     * Stille receiving error, 'cannot read locale of undefined' when running test on packages mock 
     */
    // const wrapper = mount(
    //   <MockedProvider mocks={ mocks } addTypename={ true }>
    //     <Table>
    //       <TableBody { ...props } />
    //     </Table>
    //   </MockedProvider>
    // );

    await wait( 0 );
    wrapper.update();    

    const tableBody = wrapper.find( TableBody );
    const tableRows = tableBody.find( 'tr' );    
    const rowCount = tableRows.length;
    const expectedRowCount = mocks[0].result.data.videoProjects.length;    
    // const expectedRowCount = mocks[2].result.data.packages.length;

    expect( rowCount ).toEqual( expectedRowCount );
    // expect( toJSON( tableRows ) ).toMatchSnapshot();
  } );

  /**
   * Commented out since subscribeToStatuses defined in useEffect hook
   */
  // it( 'subscribes to status updates', async () => {
  //   const spy = jest.fn();
  //   const TableBodyMock = teamProjectsQuery( wrapProps => (
  //     <TableBodyRaw { ...wrapProps } subscribeToStatuses={ spy } />
  //   ) );
  //   const Comp = (
  //     <MockedProvider mocks={ mocks } addTypename={ false }>
  //       <Table>
  //         <TableBodyMock { ...props } />
  //       </Table>
  //     </MockedProvider>
  //   );

  //   await wait( 0 );
  //   wrapper.update();
  //   expect( spy ).toHaveBeenCalled();
  // } );


  describe( 'updateProjectStatus', () => {
    const projectsType = 'videoProjects';

    it( 'updates the correct project', () => {      
      const subscriptionData = { ...mocks[1].result };
      const result = updateProjectStatus( projectsType )( { videoProjects }, { subscriptionData } );
      expect( videoProjects[0].status ).toEqual( 'PUBLISHED' );
      expect( result.videoProjects[0].status ).toEqual( 'DRAFT' );
      expect( videoProjects[0].id ).toEqual( result.videoProjects[0].id );
    } );

    it( 'does not update anything for null data', () => {
      const subscriptionData = { data: { projectStatusChange: null } };
      const prev = { videoProjects };
      const result = updateProjectStatus( projectsType )( prev, { subscriptionData } );
      expect( result ).toEqual( prev );
    } );

    it( 'does not update anything for a non existent project ID', () => {
      const subscriptionData = { ...mocks[1].result };
      subscriptionData.data.projectStatusChange.id = 'xxxx';
      const prev = { videoProjects };
      const result = updateProjectStatus( projectsType )( prev, { subscriptionData } );
      expect( result ).toEqual( prev );
    } );
  } );
} );
