import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/client/testing';
import { suppressActWarning, titleCase } from 'lib/utils';
import CategoryDropdown, { CATEGORIES_QUERY } from './CategoryDropdown';
import { categories } from './mocks';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

const props = {
  id: '123xyz',
  label: 'Categories',
  locale: 'en-us',
};

const mocks = [
  {
    request: {
      query: CATEGORIES_QUERY,
      variables: { locale: props.locale },
    },
    result: {
      data: { categories },
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
      data: { categories: null },
    },
  },
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { categories: [] },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <CategoryDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <CategoryDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <CategoryDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <CategoryDropdown { ...props } />
  </MockedProvider>
);

describe( '<CategoryDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const catDropdown = wrapper.find( 'CategoryDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( catDropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 2 );
    wrapper.update();

    const catDropdown = wrapper.find( 'CategoryDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! ${error.message}`;

    expect( catDropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if categories is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'does not crash if categories is []', async () => {
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
    const semanticUICats = categories.map( category => ( {
      key: category.id,
      value: category.id,
      text: category.translations.length
        ? titleCase( category.translations[0].name )
        : '',
    } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( semanticUICats );
    expect( dropdownItems.length ).toEqual( categories.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="categories"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
