import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import ReleaseTypeSubmenu from '../FilterSubMenu/PressSubMenu/ReleaseTypeSubmenu';
import { documentUsesQueryMock as mocks } from './mocks';

jest.mock(
  'components/FilterMenu/FilterMenuItem',
  () => function FilterMenuItem() { return ''; },
);

jest.mock( '@apollo/react-hooks', () => ( {
  useApolloClient: jest.fn( () => ( {
    readQuery: jest.fn( () => ( {
      documentUses: [
        {
          id: 'ck2xf4dtd00ew0735yz37vkxm',
          name: 'Background Briefing',
        },
        {
          id: 'ck2xf4dtv00f30735hep3rysr',
          name: 'Department Press Briefing',
        },
        {
          id: 'ck2xf4dum00fa0735gzc1glw0',
          name: 'Fact Sheet',
        },
        {
          id: 'ck2xf4dvp00fj07357dhj48zu',
          name: 'Interview',
        },
      ],
    } ) ),
  } ) ),
} ) );

const props = {
  selected: ['Background Briefing', 'Department Press Briefing'],
};

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { documentUses: null },
    },
  },
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { documentUses: [] },
    },
  },
];

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <ReleaseTypeSubmenu { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <ReleaseTypeSubmenu { ...props } />
  </MockedProvider>
);

describe( '<ReleaseTypeSubmenu', () => {
  let wrapper;
  let filterMenuItem;

  beforeEach( () => {
    wrapper = mount( <ReleaseTypeSubmenu { ...props } /> );
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
    expect( filterMenuItem.prop( 'filter' ) ).toEqual( 'Release Type' );
  } );

  it( 'renders the correct name prop', () => {
    expect( filterMenuItem.prop( 'name' ) ).toEqual( 'documentUses' );
  } );

  it( 'renders the correct menu otpions', () => {
    const formattedMockOptions = mocks[0].result.data.documentUses
      .map( use => ( {
        key: use.name,
        display_name: use.name,
        submenu: 'document'
      } ) );

    expect( filterMenuItem.prop( 'options' ) ).toEqual( formattedMockOptions );
  } );

  it( 'renders the correct formItem prop', () => {
    expect( filterMenuItem.prop( 'formItem' ) ).toEqual( 'checkbox' );
  } );
} );
