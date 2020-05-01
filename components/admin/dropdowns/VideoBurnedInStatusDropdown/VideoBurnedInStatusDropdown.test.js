import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { addEmptyOption, titleCase } from 'lib/utils';
import VideoBurnedInStatusDropdown, { VIDEO_BURNED_IN_STATUS_QUERY } from './VideoBurnedInStatusDropdown';

const props = {
  id: 's123',
  label: 'Subtitles'
};

const mocks = [
  {
    request: {
      query: VIDEO_BURNED_IN_STATUS_QUERY
    },
    result: {
      data: {
        __type: {
          enumValues: [
            { name: 'SUBTITLED' },
            { name: 'CAPTIONED' },
            { name: 'CLEAN' }
          ]
        }
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
      data: {
        __type: { enumValues: null }
      }
    }
  }
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        __type: { enumValues: [] }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VideoBurnedInStatusDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <VideoBurnedInStatusDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <VideoBurnedInStatusDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <VideoBurnedInStatusDropdown { ...props } />
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

describe( '<VideoBurnedInStatusDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'VideoBurnedInStatusDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'VideoBurnedInStatusDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if enumValues is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [
      {
        key: '-',
        text: '-',
        value: null
      }
    ];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'does not crash if enumValues is []', async () => {
    const wrapper = mount( EmptyComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [
      {
        key: '-',
        text: '-',
        value: null
      }
    ];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { enumValues } = mocks[0].result.data.__type;
    const semanticUIValues = enumValues.filter( enumValue => enumValue.name !== 'CAPTIONED' )
      .map( enumValue => {
        let text = titleCase( enumValue.name );

        text = ( text === 'Clean' ) ? `${text} - No captions` : text;

        return {
          key: enumValue.name,
          text,
          value: enumValue.name
        };
      } );

    expect( formDropdown.prop( 'options' ) )
      .toEqual( addEmptyOption( semanticUIValues ) );
    expect( dropdownItems.length ).toEqual( enumValues.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="videoBurnedInStatus"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
