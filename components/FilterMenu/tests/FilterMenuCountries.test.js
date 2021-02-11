import { mount } from 'enzyme';
import FilterMenuCountries from '../FilterMenuCountries';
import { countriesQueryMocks as mocks } from './mocks';

jest.mock(
  'components/FilterMenu/FilterMenuItem',
  () => function FilterMenuItem() { return ''; },
);
jest.mock(
  '@apollo/react-hooks',
  () => ( {
    useApolloClient: jest.fn( () => ( {
      readQuery: jest.fn( () => ( {
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
      } ) ),
    } ) ),
  } ),
);

const props = {
  selected: ['Angola', 'Albania'],
};

// const nullMocks = [
//   {
//     ...mocks[0],
//     result: {
//       data: { countries: null }
//     }
//   }
// ];

// const emptyMocks = [
//   {
//     ...mocks[0],
//     result: {
//       data: { countries: [] }
//     }
//   }
// ];

// const NullComponent = (
//   <MockedProvider mocks={ nullMocks } addTypename={ false }>
//     <FilterMenuCountries { ...props } />
//   </MockedProvider>
// );

// const EmptyComponent = (
//   <MockedProvider mocks={ emptyMocks } addTypename={ false }>
//     <FilterMenuCountries { ...props } />
//   </MockedProvider>
// );

describe( '<FilterMenuCountries />', () => {
  let wrapper;
  let menuItem;

  beforeEach( () => {
    wrapper = mount( <FilterMenuCountries { ...props } /> );
    menuItem = wrapper.find( 'FilterMenuItem' );
  } );

  it( 'renders loading state without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it.skip( 'does not crash if countries is null', () => {
    // const wrapper = mount( NullComponent );
    expect( wrapper.html() ).toEqual( '' );
  } );

  it.skip( 'does not crash if countries is []', () => {
    // const wrapper = mount( EmptyComponent );
    expect( wrapper.html() ).toEqual( '' );
  } );

  it( 'renders correct className prop value for FilterMenuItem', async () => {
    expect( menuItem.prop( 'className' ) ).toEqual( 'clamped' );
  } );

  it( 'renders correct filter prop value for FilterMenuItem', () => {
    expect( menuItem.prop( 'filter' ) ).toEqual( 'Country' );
  } );

  it( 'renders correct name prop value for FilterMenuItem', () => {
    expect( menuItem.prop( 'name' ) ).toEqual( 'countries' );
  } );

  it( 'renders correct selected prop value for FilterMenuItem', () => {
    expect( menuItem.prop( 'selected' ) ).toEqual( props.selected );
  } );

  it( 'renders correct formItem prop value for FilterMenuItem', () => {
    expect( menuItem.prop( 'formItem' ) ).toEqual( 'checkbox' );
  } );

  it( 'renders correct options prop value for FilterMenuItem', () => {
    const { countries } = mocks[0].result.data;
    const searchedCountry = '';
    const getMenuOptions = () => (
      countries.reduce( ( acc, country ) => {
        const displayName = `${country.name} (${country.abbr})`;
        const searchTerm = searchedCountry.toLowerCase().trim();

        if ( displayName.toLowerCase().includes( searchTerm ) ) {
          acc.push( {
            display_name: displayName,
            key: country.name,
          } );
        }

        return acc;
      }, [] )
    );

    expect( menuItem.prop( 'options' ) ).toEqual( getMenuOptions() );
  } );

  it( 'renders correct searchInput prop value for FilterMenuItem', () => {
    const searchInput = mount( menuItem.prop( 'searchInput' ) );

    expect( searchInput.exists() ).toEqual( true );
    expect( searchInput.prop( 'style' ) ).toEqual( {
      margin: 0,
      padding: '0.5em 1em',
    } );
  } );

  it( 'renders searchInput > VisuallyHidden component with correct props', () => {
    const searchInput = mount( menuItem.prop( 'searchInput' ) );
    const visuallyHidden = searchInput.find( 'VisuallyHidden > div.hide-visually' );
    const visuallyHiddenLabel = searchInput.find( 'label' );

    expect( visuallyHidden.exists() ).toEqual( true );
    expect( visuallyHiddenLabel.prop( 'htmlFor' ) )
      .toEqual( 'filter-countries' );
    expect( visuallyHiddenLabel.contains( 'Search countries' ) )
      .toEqual( true );
  } );

  it( 'renders searchInput > FormInput component with correct props', () => {
    const searchInput = mount( menuItem.prop( 'searchInput' ) );
    const formInput = searchInput.find( 'FormInput' );

    expect( formInput.exists() ).toEqual( true );
    expect( formInput.prop( 'id' ) ).toEqual( 'filter-countries' );
    expect( formInput.prop( 'placeholder' ) ).toEqual( 'Search countries' );
    expect( formInput.prop( 'name' ) ).toEqual( 'countries' );
    expect( formInput.prop( 'icon' ) ).toEqual( 'search' );
    expect( formInput.prop( 'iconPosition' ) ).toEqual( 'left' );
    expect( typeof formInput.prop( 'onChange' ) ).toEqual( 'function' );
    expect( formInput.prop( 'onChange' ).name ).toEqual( 'handleChange' );
  } );
} );
