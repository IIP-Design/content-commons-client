import { mount } from 'enzyme';
import { Grid, Loader } from 'semantic-ui-react';

import TableItemsDisplay from './TableItemsDisplay';

const searchTerm = 'Made in America';
const noResultsSearch = 'lorem ipsum';

const props = {
  count: 10,
  error: null,
  loading: false,
  handleChange: jest.fn(),
  itemsPerPage: 5,
  searchTerm: '',
  skip: 0,
};

const options = [
  { key: 15, value: 15, text: '15' },
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 75, value: 75, text: '75' },
  { key: 100, value: 100, text: '100' },
];

describe( '<TableItemsDisplay />', () => {
  it( 'renders initial loading state without crashing', () => {
    const newProps = { ...props, count: undefined, loading: true };

    const wrapper = mount( <TableItemsDisplay { ...newProps } /> );

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

  it( 'renders error message if an error is returned', () => {
    const newProps = { ...props, error: { message: 'There was an error.' } };

    const wrapper = mount( <TableItemsDisplay { ...newProps } /> );

    const errorComponent = wrapper.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    // expect( errorComponent.contains( 'There was an error.' ) )
    //   .toEqual( true );
  } );

  it( 'renders null if count is null', () => {
    const newProps = { ...props, count: null };

    const wrapper = mount( <TableItemsDisplay { ...newProps } /> );

    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders a "No projects" message if there are no video projects', () => {
    const newProps = { ...props, count: 0 };

    const wrapper = mount( <TableItemsDisplay { ...newProps } /> );

    const noProjectsMsg = <span>No projects</span>;

    expect( wrapper.contains( noProjectsMsg ) ).toEqual( true );
  } );

  it( 'renders the correct status message when the range < count', () => {
    const wrapper = mount( <TableItemsDisplay { ...props } /> );

    const firstPageItem = props.skip + 1;
    const range = props.skip + props.itemsPerPage;
    const lastPageItem = range < props.count ? range : props.count;

    const displayMsg = <span>{ `${firstPageItem} - ${lastPageItem} of ${props.count}` }</span>;

    expect( wrapper.contains( displayMsg ) ).toEqual( true );
  } );

  it( 'renders the correct status message when the range > projectsCount', () => {
    const count = 2;
    const newProps = { ...props, count };

    const wrapper = mount( <TableItemsDisplay { ...newProps } /> );

    const firstPageItem = props.skip + 1;
    const range = props.skip + props.itemsPerPage;
    const lastPageItem = range < count ? range : count;
    const displayMsg = <span>{ `${firstPageItem} - ${lastPageItem} of ${count}` }</span>;

    expect( wrapper.contains( displayMsg ) ).toEqual( true );
  } );

  // it( 'renders the correct status message for a search term', async () => {
  //   const wrapper = mount(
  //     <MockedProvider mocks={ mocks } addTypename={ false }>
  //       <TableItemsDisplay
  //         { ...{
  //           ...props,
  //           ...{
  //             searchTerm,
  //             variables: { ...props.variables, searchTerm }
  //           }
  //         } }
  //       />
  //     </MockedProvider>
  //   );

  //   await wait( 0 );
  //   wrapper.update();

  //   const tableItemsDisplay = wrapper.find( TableItemsDisplay );
  //   const projectsCount = mocks[1].result.data.videoProjects.length;
  //   const firstPageItem = props.variables.skip + 1;
  //   const range = props.variables.skip + props.value;
  //   const lastPageItem = range < projectsCount ? range : projectsCount;
  //   const displayMsg = <span>{ firstPageItem } - { lastPageItem } of { projectsCount }{ searchTerm && <Fragment> for &ldquo;{ searchTerm }&rdquo;</Fragment> }</span>;

  //   expect( tableItemsDisplay.contains( displayMsg ) ).toEqual( true );
  // } );

  // it( 'renders the correct status message for a no results search', () => {
  //   const wrapper = mount( <TableItemsDisplay
  //     { ...{
  //       ...props,
  //       ...{
  //         searchTerm: noResultsSearch,
  //         variables: {
  //           ...props.variables,
  //           searchTerm: noResultsSearch
  //         }
  //       }
  //     } }
  //   /> );

  //   const tableItemsDisplay = wrapper.find( TableItemsDisplay );
  //   const displayMsg = (
  //     <span>
  //       No
  //       {' '}
  //       { noResultsSearch ? 'results' : 'projects' }
  //       { noResultsSearch && (
  //         <Fragment>
  //           {' '}
  //           for &ldquo;
  //           { noResultsSearch }
  //           &rdquo;
  //         </Fragment>
  //       ) }
  //     </span>
  //   );

  //   expect( tableItemsDisplay.contains( displayMsg ) ).toEqual( true );
  // } );

  it( 'renders the Dropdown component', () => {
    const wrapper = mount( <TableItemsDisplay { ...props } /> );

    const dropdown = wrapper.find( 'Dropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'value' ) ).toEqual( props.itemsPerPage );
    expect( dropdown.prop( 'options' ) ).toEqual( options );
  } );

  it( 'Dropdown change event calls handleChange', () => {
    const wrapper = mount( <TableItemsDisplay { ...props } /> );

    const dropdown = wrapper.find( 'Dropdown' );

    dropdown.simulate( 'change' );
    expect( props.handleChange ).toHaveBeenCalledTimes( 1 );
  } );
} );
