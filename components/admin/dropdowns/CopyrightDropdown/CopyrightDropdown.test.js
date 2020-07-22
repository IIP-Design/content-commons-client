import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import CopyrightDropdown, { COPYRIGHT_QUERY } from './CopyrightDropdown';

import { suppressActWarning } from 'lib/utils';

const props = {
  id: 'copyright',
  label: 'Copyright',
};

const mocks = [
  {
    request: {
      query: COPYRIGHT_QUERY,
    },
    result: {
      data: {
        __type: {
          enumValues: [
            { name: 'COPYRIGHT' },
            { name: 'NO_COPYRIGHT' },
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

describe( '<CopyrightDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <CopyrightDropdown { ...props } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <CopyrightDropdown { ...props } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <CopyrightDropdown { ...props } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <CopyrightDropdown { ...props } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'CopyrightDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'CopyrightDropdown' );
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
    const options = enumValues.map( obj => {
      const text = obj.name === 'COPYRIGHT'
        ? 'Copyright terms outlined in internal description'
        : 'No copyright beyond provided watermark attribution';

      return {
        key: obj.name,
        text,
        value: obj.name,
      };
    } );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( enumValues.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="copyright"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
