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
          offices: [
            {
              id: 'ck52kidy209540835guafy5cu',
              name: 'Office of Logistics Management',
            },
            {
              id: 'ck52kidyo095d0835wjv2bbju',
              name: 'Office of Procurement Executive',
            },
          ],
        },
        {
          id: 'ck52kids8093p0835atpqri31',
          name: 'Bureau of African Affairs',
          offices: [],
        },
        {
          id: 'ck52kids8093q08354wi55vnx',
          name: 'Bureau of Budget and Planning',
          offices: [],
        },
        {
          id: 'ck52kids8093r0835xx5w8jwt',
          name: 'Bureau of Consular Affairs',
          offices: [],
        },
        {
          id: 'ck52kidsd093x0835b43j0ar5',
          name: 'Bureau of Diplomatic Security',
          offices: [],
        },
        {
          id: 'ck52kidse093y0835ii1iqirb',
          name: 'Bureau of East Asian and Pacific Affairs',
          offices: [],
        },
        {
          id: 'ck52kidse093z0835kx2a59vk',
          name: 'Bureau of Educational and Cultural Afairs',
          offices: [],
        },
        {
          id: 'ck52kidse09400835j77rsax2',
          name: 'Bureau of Global Public Affairs',
          offices: [
            {
              id: 'ck52kidxf09500835rj1ult2z',
              name: 'Office of Global Social Media',
            },
            {
              id: 'ck52kidyl095b0835u2myl170',
              name: 'Office of the Spokesperson',
            },
            {
              id: 'ck52kidyo095c08356l36615v',
              name: 'Office of Public Liaison',
            },
          ],
        },
        {
          id: 'ck52kidse094108350vo7h40x',
          name: 'Bureau of Human Resources',
          offices: [],
        },
        {
          id: 'ck52kidse094208354oztjyfw',
          name: 'Bureau of Near Eastern Affairs',
          offices: [],
        },
        {
          id: 'ck52kidse09430835woniokoo',
          name: 'Bureau of South and Central Asian Affairs',
          offices: [],
        },
        {
          id: 'ck52kidsf09440835lvl55c1q',
          name: 'Bureau of Western Hemisphere Affairs',
          offices: [],
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

  it( 'renders the correct menu options', () => {
    const bureausCollection = mocks[0].result.data.bureaus
      .map( bureau => ( {
        key: bureau.name,
        display_name: bureau.name,
      } ) );

    const officesCollection = mocks[0].result.data.bureaus
      .filter( bureau => bureau.offices.length > 0 )
      .reduce( ( offices, bureau ) => {
        const formatOffices = bureau.offices.map( office => ( {
          key: office.name,
          display_name: office.name,
        } ) );

        return [...offices, ...formatOffices];
      }, [] );

    const formattedMockOptions = [...bureausCollection, ...officesCollection];

    expect( filterMenuItem.prop( 'options' ) ).toEqual( formattedMockOptions );
  } );

  it( 'renders the correct formItem prop', () => {
    expect( filterMenuItem.prop( 'formItem' ) ).toEqual( 'checkbox' );
  } );
} );
