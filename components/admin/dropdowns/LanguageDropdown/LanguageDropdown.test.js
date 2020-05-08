import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import sortBy from 'lodash/sortBy';
import { addEmptyOption } from 'lib/utils';
import LanguageDropdown, { LANGUAGES_QUERY } from './LanguageDropdown';
import { languages } from './mocks';

const props = {
  id: '123xyz',
  label: 'Language'
};

const localesProps = {
  ...props,
  locales: ['en-us', 'fr-fr']
};

const mocks = [
  {
    request: {
      query: LANGUAGES_QUERY
    },
    result: {
      data: { languages }
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
      data: { languages: null }
    }
  }
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { languages: [] }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <LanguageDropdown { ...props } />
  </MockedProvider>
);

const LocalesComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <LanguageDropdown { ...localesProps } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <LanguageDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <LanguageDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <LanguageDropdown { ...props } />
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

describe( '<LanguageDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'LanguageDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'LanguageDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if languages is null', async () => {
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

  it( 'does not crash if languages is []', async () => {
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
    const semanticUILangs = sortBy( languages, lang => lang.displayName )
      .map( lang => ( {
        key: lang.id,
        text: lang.displayName,
        value: lang.id
      } ) );
    const options = addEmptyOption( semanticUILangs );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( languages.length + 1 );
  } );

  it( 'renders the final state without crashing when there are multiple locales', async () => {
    const wrapper = mount( LocalesComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const filteredLangs = languages.filter( lang => {
      const { locale } = lang;

      return localesProps.locales.includes( locale );
    } );
    const semanticUILangs = sortBy( filteredLangs, lang => lang.displayName )
      .map( lang => ( {
        key: lang.id,
        text: lang.displayName,
        value: lang.id
      } ) );
    const options = addEmptyOption( semanticUILangs );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( filteredLangs.length + 1 );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="language"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
