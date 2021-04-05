import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/client/testing';
import sortBy from 'lodash/sortBy';
import BureauOfficesDropdown, { BUREAU_OFFICES_QUERY } from './BureauOfficesDropdown';
import { suppressActWarning } from 'lib/utils';

const props = {
  id: '123xyz',
  label: 'Bureau/Offices',
};

const mocks = [
  {
    request: {
      query: BUREAU_OFFICES_QUERY,
    },
    result: {
      data: {
        bureaus: [
          {
            id: 'sdfq',
            name: 'Bureau of Global Public Affairs',
            abbr: 'GPA',
            offices: [
              {
                id: 'kglf',
                name: 'Press Office',
                abbr: 'PO',
              },
              {
                id: 'eiwo',
                name: 'Office 2',
                abbr: 'O2',
              },
            ],
          },
          {
            id: 'weio',
            name: 'Bureau 2',
            abbr: 'B2',
            offices: [
              {
                id: 'eiwo',
                name: 'Office 2',
                abbr: 'O2',
              },
            ],
          },
          {
            id: 'xzwi',
            name: 'Bureau 3',
            abbr: 'B3',
            offices: [
              {
                id: 'kglf',
                name: 'Office 1',
                abbr: 'O1',
              },
            ],
          },
          {
            id: 'zxcw',
            name: 'Bureau 4',
            abbr: 'B4',
            offices: [
              {
                id: 'kglf',
                name: 'Office 1',
                abbr: 'O1',
              },
              {
                id: 'eiwo',
                name: 'Office 2',
                abbr: 'O2',
              },
            ],
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

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <BureauOfficesDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <BureauOfficesDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <BureauOfficesDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <BureauOfficesDropdown { ...props } />
  </MockedProvider>
);

describe( '<BureauOfficesDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'BureauOfficesDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 2 );
    wrapper.update();

    const dropdown = wrapper.find( 'BureauOfficesDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if bureaus is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'does not crash if bureaus is []', async () => {
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
    const { bureaus } = mocks[0].result.data;
    const options = sortBy( bureaus, bureau => bureau.name )
      .map( bureau => ( {
        key: bureau.id,
        text: `${bureau.name} (${bureau.abbr})`,
        value: bureau.id,
      } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( bureaus.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="bureaus"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
