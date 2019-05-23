import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Pagination } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import TablePagination, { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from './TablePagination';

const props = {
  activePage: 1,
  handlePageChange: jest.fn(),
  itemsPerPage: 2,
  variables: {
    team: 'IIP Video Production',
    searchTerm: ''
  }
};

const mocks = [
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: { ...props.variables }
    },
    result: {
      data: {
        videoProjects: [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
          { id: '6' },
          { id: '7' }
        ]
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <TablePagination { ...props } />
  </MockedProvider>
);

describe( '<TablePagination />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const pagination = wrapper.find( TablePagination );

    expect( pagination.exists() ).toEqual( true );
    expect( pagination.contains( 'Loading....' ) ).toEqual( true );
  } );

  it( 'renders error message if an error is returned', async () => {
    const errorMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
          variables: { ...props.variables }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <TablePagination { ...props } />
      </MockedProvider>
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const pagination = wrapper.find( TablePagination );
    const errorComponent = pagination.find( ApolloError );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders null if videoProjects is null', async () => {
    const nullMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: { videoProjects: null }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <TablePagination { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const pagination = wrapper.find( TablePagination );

    expect( pagination.html() ).toEqual( null );
  } );

  it( 'renders null if there are no video projects', async () => {
    const emptyMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: { videoProjects: [] }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptyMocks } addTypename={ false }>
        <TablePagination { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const pagination = wrapper.find( TablePagination );

    expect( pagination.html() ).toEqual( null );
  } );

  it( 'renders the correct number of pages', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const pagination = wrapper.find( Pagination );
    const paginationItems = pagination.find( 'PaginationItem' );
    const projectsCount = mocks[0].result.data.videoProjects.length;
    const totalPages = Math.ceil( projectsCount / props.itemsPerPage );

    expect( pagination.prop( 'totalPages' ) ).toEqual( totalPages );
    // add 2 to include Previous & Next
    expect( paginationItems.length ).toEqual( totalPages + 2 );
  } );

  it( 'disables prevItem initially when activePage is the first page', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const pagination = wrapper.find( Pagination );

    expect( pagination.prop( 'activePage' ) ).toEqual( props.activePage );
    expect( pagination.prop( 'prevItem' ).disabled ).toEqual( true );
  } );

  it( 'disables nextItem if activePage is the last page', async () => {
    const projectsCount = mocks[0].result.data.videoProjects.length;
    const lastPage = Math.ceil( projectsCount / props.itemsPerPage );
    const newProps = { ...props, ...{ activePage: lastPage } };

    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <TablePagination { ...newProps } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const pagination = wrapper.find( Pagination );

    expect( pagination.prop( 'activePage' ) ).toEqual( lastPage );
    expect( pagination.prop( 'nextItem' ).disabled ).toEqual( true );
  } );

  it( 'enables prevItem & nextItem if activePage is neither the first nor last page', async () => {
    const projectsCount = mocks[0].result.data.videoProjects.length;
    const totalPages = Math.ceil( projectsCount / props.itemsPerPage );
    const newProps = { ...props, ...{ activePage: 2 } };

    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <TablePagination { ...newProps } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const pagination = wrapper.find( Pagination );

    expect( totalPages ).toBeGreaterThan( 2 );
    expect( pagination.prop( 'prevItem' ).disabled ).toEqual( false );
    expect( pagination.prop( 'nextItem' ).disabled ).toEqual( false );
  } );

  it( 'changing the page calls handlePageChange', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const pagination = wrapper.find( Pagination );

    pagination.prop( 'onPageChange' )();
    expect( props.handlePageChange ).toHaveBeenCalled();
  } );
} );
