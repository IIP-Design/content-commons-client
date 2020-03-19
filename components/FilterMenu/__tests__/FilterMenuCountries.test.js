import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { getCount } from 'lib/utils';
import FilterMenuCountries from '../FilterMenuCountries';
import { countriesQueryMocks as mocks } from '../mocks';

jest.mock(
  'components/FilterMenu/FilterMenuItem',
  () => function FilterMenuItem() { return ''; }
);

const props = {
  selected: ['Angola', 'Albania']
};

const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { countries: null }
    }
  }
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { countries: [] }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <FilterMenuCountries { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <FilterMenuCountries { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <FilterMenuCountries { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <FilterMenuCountries { ...props } />
  </MockedProvider>
);

describe( '<FilterMenuCountries />', () => {
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
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );
    const loader = wrapper.find( 'Loader' );
    const loaderWrapper = wrapper.find( 'FilterMenuCountries > div' );
    const loaderMsg = loaderWrapper.find( 'span' );

    expect( countriesMenu.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( countriesMenu.contains( 'Loading...' ) ).toEqual( true );
    expect( loaderWrapper.prop( 'style' ) ).toEqual( {
      display: 'flex',
      alignItems: 'center',
      marginTop: '0.625rem'
    } );
    expect( loaderMsg.prop( 'style' ) ).toEqual( {
      color: '#112e51',
      fontSize: '0.888888889rem'
    } );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();

    const apolloError = wrapper.find( 'ApolloError' );
    const { message } = errorMocks[0].result.errors[0];

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.contains( message ) ).toEqual( true );
  } );

  it( 'does not crash if countries is null', async () => {
    const wrapper = mount( NullComponent );
    await wait( 0 );
    wrapper.update();
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );

    expect( countriesMenu.html() ).toEqual( '' );
  } );

  it( 'does not crash if countries is []', async () => {
    const wrapper = mount( EmptyComponent );
    await wait( 0 );
    wrapper.update();
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );

    expect( countriesMenu.html() ).toEqual( '' );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );

    expect( menuItem.exists() ).toEqual( true );
  } );

  it( 'renders correct className prop value for FilterMenuItem', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );

    expect( menuItem.prop( 'className' ) ).toEqual( 'clamped' );
  } );

  it( 'renders correct filter prop value for FilterMenuItem', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );

    expect( menuItem.prop( 'filter' ) ).toEqual( 'Country' );
  } );

  it( 'renders correct name prop value for FilterMenuItem', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );

    expect( menuItem.prop( 'name' ) ).toEqual( 'countries' );
  } );

  it( 'renders correct selected prop value for FilterMenuItem', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );

    expect( menuItem.prop( 'selected' ) ).toEqual( props.selected );
  } );

  it( 'renders correct formItem prop value for FilterMenuItem', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );

    expect( menuItem.prop( 'formItem' ) ).toEqual( 'checkbox' );
  } );

  it( 'renders correct options prop value for FilterMenuItem', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );
    const { countries } = mocks[0].result.data;
    const searchedCountry = '';
    const getMenuOptions = () => {
      if ( getCount( countries ) ) {
        return countries.reduce( ( acc, country ) => {
          const name = country.name.toLowerCase();
          const searchTerm = searchedCountry.toLowerCase();

          if ( name.includes( searchTerm ) ) {
            acc.push( {
              display_name: country.name,
              key: country.name
            } );
          }
          return acc;
        }, [] );
      }
      return [];
    };

    expect( menuItem.prop( 'options' ) ).toEqual( getMenuOptions() );
  } );

  it( 'renders correct searchInput prop value for FilterMenuItem', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );
    const searchInput = mount( menuItem.prop( 'searchInput' ) );

    expect( searchInput.exists() ).toEqual( true );
    expect( searchInput.prop( 'style' ) ).toEqual( {
      margin: 0,
      padding: '0.5em 1em'
    } );
  } );

  it( 'renders searchInput > VisuallyHidden component with correct props', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );
    const searchInput = mount( menuItem.prop( 'searchInput' ) );
    const visuallyHidden = searchInput.find( 'VisuallyHidden > div.hide-visually' );
    const visuallyHiddenLabel = searchInput.find( 'label' );

    expect( visuallyHidden.exists() ).toEqual( true );
    expect( visuallyHiddenLabel.prop( 'htmlFor' ) )
      .toEqual( 'filter-countries' );
    expect( visuallyHiddenLabel.contains( 'Search countries' ) )
      .toEqual( true );
  } );

  it( 'renders searchInput > FormInput component with correct props', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const menuItem = wrapper.find( 'FilterMenuItem' );
    const searchInput = mount( menuItem.prop( 'searchInput' ) );
    const formInput = searchInput.find( 'FormInput' );

    expect( formInput.exists() ).toEqual( true );
    expect( formInput.prop( 'id' ) ).toEqual( 'filter-countries' );
    expect( formInput.prop( 'placeholder' ) ).toEqual( 'Search countries' );
    expect( formInput.prop( 'name' ) ).toEqual( 'countries' );
    expect( formInput.prop( 'icon' ) ).toEqual( 'search' );
    expect( typeof formInput.prop( 'onChange' ) ).toEqual( 'function' );
    expect( formInput.prop( 'onChange' ).name ).toEqual( 'handleChange' );
  } );
} );
