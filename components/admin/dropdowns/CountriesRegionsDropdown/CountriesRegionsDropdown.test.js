import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import sortBy from 'lodash/sortBy';
import CountriesRegionsDropdown, { COUNTRIES_REGION_QUERY } from './CountriesRegionsDropdown';

const props = {
  id: '123xyz',
  label: 'Countries/Regions Tags'
};

const mocks = [
  {
    request: {
      query: COUNTRIES_REGION_QUERY
    },
    result: {
      data: {
        countries: [
          {
            id: 'sdfq',
            name: 'Country 1',
            abbr: 'C1',
            region: {
              id: 'kglf',
              name: 'Region 1',
              abbr: 'R1',
            }
          },
          {
            id: 'weio',
            name: 'Country 2',
            abbr: 'C2',
            region: {
              id: 'eiwo',
              name: 'Region 2',
              abbr: 'R2'
            }
          },
          {
            id: 'xzwi',
            name: 'Country 3',
            abbr: 'C3',
            region: {
              id: 'kglf',
              name: 'Region 1',
              abbr: 'R1'
            }
          },
          {
            id: 'zxcw',
            name: 'Country 4',
            abbr: 'C4',
            region: {
              id: 'kglf',
              name: 'Region 1',
              abbr: 'R1'
            }
          }
        ]
      }
    }
  }
];

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
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <CountriesRegionsDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <CountriesRegionsDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <CountriesRegionsDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <CountriesRegionsDropdown { ...props } />
  </MockedProvider>
);

describe( '<CountriesRegionsDropdown />', () => {
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
    const dropdown = wrapper.find( 'CountriesRegionsDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'CountriesRegionsDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if countries is null', async () => {
    const wrapper = mount( NullComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'does not crash if countries is []', async () => {
    const wrapper = mount( EmptyComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { countries } = mocks[0].result.data;
    const options = sortBy( countries, country => country.name )
      .map( country => ( {
        key: country.id,
        text: `${country.name} (${country.region.abbr})`,
        value: country.id
      } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( countries.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="countries"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
