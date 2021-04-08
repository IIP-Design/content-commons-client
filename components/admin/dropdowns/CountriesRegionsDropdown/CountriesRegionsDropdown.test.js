import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';
import sortBy from 'lodash/sortBy';
import wait from 'waait';

import CountriesRegionsDropdown from './CountriesRegionsDropdown';

import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';
import { suppressActWarning } from 'lib/utils';

const props = {
  id: '123xyz',
  label: 'Countries/Regions Tags',
};

const mocks = [
  {
    request: {
      query: COUNTRIES_REGIONS_QUERY,
    },
    result: {
      data: {
        countries: [
          {
            __typename: 'Country',
            id: 'ck6krp96x3f3m0720yet8wkch',
            name: 'Antigua and Barbuda',
            abbr: 'WHA',
            region: {
              __typename: 'Region',
              id: 'ck6krp96o3f3k0720aoufd395',
              name: 'Bureau of Western Hemisphere Affairs',
              abbr: 'WHA',
            },
          },
          {
            __typename: 'Country',
            id: 'ck6krp96x3f3n0720q1289gee',
            name: 'Angola',
            abbr: 'AF',
            region: {
              __typename: 'Region',
              id: 'ck6krp96g3f3c0720c1w09bx1',
              name: 'Bureau of African Affairs',
              abbr: 'AF',
            },
          },
          {
            __typename: 'Country',
            id: 'ck6krp96y3f3o0720mg6m44hb',
            name: 'Algeria',
            abbr: 'NEA',
            region: {
              __typename: 'Region',
              id: 'ck6krp96o3f3i07201zo5ai59',
              name: 'Bureau of Near Eastern Affairs',
              abbr: 'NEA',
            },
          },
          {
            __typename: 'Country',
            id: 'ck6krp96y3f3p0720ncj81nes',
            name: 'Albania',
            abbr: 'EUR',
            region: {
              __typename: 'Region',
              id: 'ck6krp96o3f3h07201q3rj4n7',
              name: 'Bureau of European and Eurasian Affairs',
              abbr: 'EUR',
            },
          },
        ],
      },
    },
  },
];

const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
];

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { countries: null },
    },
  },
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { countries: [] },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
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
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
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

    await wait( 2 );
    wrapper.update();

    const dropdown = wrapper.find( 'CountriesRegionsDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! ${error.message}`;

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
        text: `${country.name} (${country.abbr})`,
        value: country.id,
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
