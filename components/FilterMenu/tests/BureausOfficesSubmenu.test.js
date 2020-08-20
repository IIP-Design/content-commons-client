import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import BureausOfficesSubmenu from '../FilterSubMenu/PressSubMenu/BureausOfficesSubmenu';
import { bureausOfficesQueryMock as mocks } from './mocks';

jest.mock(
  'components/FilterMenu/FilterMenuItem',
  () => function FilterMenuItem() { return ''; },
);

jest.mock( '@apollo/react-hooks', () => ( {
  useApolloClient: jest.fn( () => ( {
    readQuery: jest.fn( () => ( {
      bureaus: [
        {
          id: 'ck52kids1093m0835latg8zzg',
          name: 'Bureau of Administration',
        },
        {
          id: 'ck52kids8093p0835atpqri31',
          name: 'Bureau of African Affairs',
        },
        {
          id: 'ck52kids8093q08354wi55vnx',
          name: 'Bureau of Budget and Planning',
        },
        {
          id: 'ck52kids8093r0835xx5w8jwt',
          name: 'Bureau of Consular Affairs',
        },
      ],
    } ) ),
  } ) ),
} ) );

const props = {
  selected: ['Bureau of Administration', 'Bureau of African Affairs'],
};

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { bureaus: null },
    },
  },
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { bureaus: [] },
    },
  },
];

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <BureausOfficesSubmenu { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <BureausOfficesSubmenu { ...props } />
  </MockedProvider>
);

describe( '<BureausOfficesSubmenu', () => {
  let wrapper;
  let filterMenuItem;

  beforeEach( () => {
    wrapper = mount( <BureausOfficesSubmenu { ...props } /> );
    filterMenuItem = wrapper.find( 'FilterMenuItem' );
  } );

  it( 'renders w/o crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not crash if documentUses are null', () => {
    const wrapperNull = mount( NullComponent );

    expect( wrapperNull.html() ).toEqual( '' );
  } );

  it( 'does not crash if documentUses is []', () => {
    const wrapperEmpty = mount( EmptyComponent );

    expect( wrapperEmpty.html() ).toEqual( '' );
  } );

  it( 'renders the correct className', () => {
    expect( filterMenuItem.prop( 'className' ) ).toEqual( 'subfilter' );
  } );

  it( 'renders the correct selected prop', () => {
    expect( filterMenuItem.prop( 'selected' ) ).toEqual( props.selected );
  } );

  it( 'renders the correct filter name', () => {
    expect( filterMenuItem.prop( 'filter' ) ).toEqual( 'Bureaus & Offices' );
  } );

  it( 'renders the correct name prop', () => {
    expect( filterMenuItem.prop( 'name' ) ).toEqual( 'bureausOffices' );
  } );

  it( 'renders the correct menu otpions', () => {
    const formattedMockOptions = mocks[0].result.data.bureaus
      .map( bureau => ( {
        key: bureau.name,
        display_name: bureau.name,
      } ) );

    expect( filterMenuItem.prop( 'options' ) ).toEqual( formattedMockOptions );
  } );

  it( 'renders the correct formItem prop', () => {
    expect( filterMenuItem.prop( 'formItem' ) ).toEqual( 'checkbox' );
  } );
} );
