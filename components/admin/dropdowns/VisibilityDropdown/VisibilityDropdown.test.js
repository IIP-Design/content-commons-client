import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import VisibilityDropdown, { VISIBILITY_QUERY } from './VisibilityDropdown';

const props = {
  id: 'v123',
  label: 'Visibility Setting',
};

const mocks = [
  {
    request: {
      query: VISIBILITY_QUERY,
    },
    result: {
      data: {
        __type: {
          enumValues: [
            { name: 'INTERNAL' },
            { name: 'PUBLIC' },
          ],
        },
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
      data: {
        __type: { enumValues: null },
      },
    },
  },
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        __type: { enumValues: [] },
      },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VisibilityDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <VisibilityDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <VisibilityDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <VisibilityDropdown { ...props } />
  </MockedProvider>
);

const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';

  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};

describe( '<VisibilityDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'VisibilityDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'VisibilityDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if enumValues is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'does not crash if enumValues is []', async () => {
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
    const { enumValues } = mocks[0].result.data.__type;
    const semanticUIValues = enumValues.map( enumValue => {
      const text = enumValue.name === 'PUBLIC'
        ? 'Public (displayed on Content Commons)'
        : 'Internal (Department of State only)';

      return {
        key: enumValue.name,
        text,
        value: enumValue.name,
      };
    } );

    expect( formDropdown.prop( 'options' ) ).toEqual( semanticUIValues );
    expect( dropdownItems.length ).toEqual( enumValues.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="visibility"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
