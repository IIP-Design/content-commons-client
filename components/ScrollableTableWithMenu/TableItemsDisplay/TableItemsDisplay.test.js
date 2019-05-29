import { Fragment } from 'react';
import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Dropdown, Grid, Loader } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from '../TablePagination/TablePagination';
import TableItemsDisplay from './TableItemsDisplay';

const searchTerm = 'Made in America';
const noResultsSearch = 'lorem ipsum';
const props = {
  handleChange: jest.fn(),
  searchTerm: '',
  value: 4,
  variables: {
    team: 'IIP Video Production',
    searchTerm: '',
    first: 4,
    skip: 0
  }
};

const options = [
  { key: 2, value: 2, text: '2' },
  { key: 4, value: 4, text: '4' },
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 75, value: 75, text: '75' },
  { key: 100, value: 100, text: '100' }
];

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
          { id: '7' },
          { id: '8' }
        ]
      }
    }
  },
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: { ...props.variables, searchTerm }
    },
    result: {
      data: {
        videoProjects: [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' }
        ]
      }
    }
  },
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: { ...props.variables, searchTerm: noResultsSearch }
    },
    result: {
      data: { videoProjects: [] }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <TableItemsDisplay { ...props } />
  </MockedProvider>
);

describe( '<TableItemsDisplay />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const loader = (
      <Grid.Column className="items_display">
        <Loader active inline size="mini" />
        <span>Loading...</span>
      </Grid.Column>
    );

    expect( tableItemsDisplay.exists() ).toEqual( true );
    expect( tableItemsDisplay.contains( loader ) ).toEqual( true );
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
        <TableItemsDisplay { ...props } />
      </MockedProvider>
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const errorComponent = tableItemsDisplay.find( ApolloError );

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
        <TableItemsDisplay { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );

    expect( tableItemsDisplay.html() ).toEqual( null );
  } );

  it( 'renders a "No projects" message if there are no video projects', async () => {
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
        <TableItemsDisplay { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const noProjectsMsg = <span>No projects</span>;

    expect( tableItemsDisplay.contains( noProjectsMsg ) ).toEqual( true );
  } );

  it( 'renders the correct status message when the range < projectsCount', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const projectsCount = mocks[0].result.data.videoProjects.length;
    const firstPageItem = props.variables.skip + 1;
    const range = props.variables.skip + props.value;
    const lastPageItem = range < projectsCount ? range : projectsCount;
    const displayMsg = <span>{ `${firstPageItem} - ${lastPageItem} of ${projectsCount}` }</span>;

    expect( tableItemsDisplay.contains( displayMsg ) ).toEqual( true );
  } );

  it( 'renders the correct status message when the range > projectsCount', async () => {
    const lowCountMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
          variables: { ...props.variables }
        },
        result: {
          data: {
            videoProjects: [{ id: '1' }, { id: '2' }]
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ lowCountMocks } addTypename={ false }>
        <TableItemsDisplay { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const projectsCount = lowCountMocks[0].result.data.videoProjects.length;
    const firstPageItem = props.variables.skip + 1;
    const range = props.variables.skip + props.value;
    const lastPageItem = range < projectsCount ? range : projectsCount;
    const displayMsg = <span>{ `${firstPageItem} - ${lastPageItem} of ${projectsCount}` }</span>;

    expect( tableItemsDisplay.contains( displayMsg ) ).toEqual( true );
  } );

  it( 'renders the correct status message for a search term', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <TableItemsDisplay
          { ...{
            ...props,
            ...{
              searchTerm,
              variables: { ...props.variables, searchTerm }
            }
          } }
        />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const projectsCount = mocks[1].result.data.videoProjects.length;
    const firstPageItem = props.variables.skip + 1;
    const range = props.variables.skip + props.value;
    const lastPageItem = range < projectsCount ? range : projectsCount;
    const displayMsg = <span>{ firstPageItem } - { lastPageItem } of { projectsCount }{ searchTerm && <Fragment> for &ldquo;{ searchTerm }&rdquo;</Fragment> }</span>;

    expect( tableItemsDisplay.contains( displayMsg ) ).toEqual( true );
  } );

  it( 'renders the correct status message for a no results search', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <TableItemsDisplay
          { ...{
            ...props,
            ...{
              searchTerm: noResultsSearch,
              variables: {
                ...props.variables,
                searchTerm: noResultsSearch
              }
            }
          } }
        />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const displayMsg = <span>No { noResultsSearch ? 'results' : 'projects' }{ noResultsSearch && <Fragment> for &ldquo;{ noResultsSearch }&rdquo;</Fragment> }</span>;

    expect( tableItemsDisplay.contains( displayMsg ) ).toEqual( true );
  } );

  it( 'renders the Dropdown component', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const dropdown = tableItemsDisplay.find( Dropdown );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'value' ) ).toEqual( props.value );
    expect( dropdown.prop( 'options' ) ).toEqual( options );
  } );

  it( 'Dropdown change event calls handleChange', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const tableItemsDisplay = wrapper.find( TableItemsDisplay );
    const dropdown = tableItemsDisplay.find( Dropdown );

    dropdown.simulate( 'change' );
    expect( props.handleChange ).toHaveBeenCalled();
  } );
} );
