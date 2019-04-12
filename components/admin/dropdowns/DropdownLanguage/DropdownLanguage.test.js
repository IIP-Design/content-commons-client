import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import DropdownLanguage, { LANGUAGES_QUERY } from './DropdownLanguage';

const props = {
  id: 'm123',
  name: 'fileLanguageId',
  onChange: jest.fn(),
  value: 'eng13',
  fluid: true,
  required: true
};

const mocks = [
  {
    request: {
      query: LANGUAGES_QUERY,
      variables: { orderBy: 'displayName_ASC' }
    },
    result: {
      data: {
        languages: [
          { value: 'eng13', text: 'English' },
          { value: 'fr143', text: 'French' }
        ]
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <DropdownLanguage { ...props } />
  </MockedProvider>
);

describe( '<DropdownLanguage />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'DropdownLanguage' );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.contains( 'Loading language...' ) ).toEqual( true );
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: LANGUAGES_QUERY,
          variables: { orderBy: 'displayName_ASC' }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <DropdownLanguage { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const dropdown = wrapper.find( 'DropdownLanguage' );

    expect( dropdown.contains( 'Loading error...' ) ).toEqual( true );
  } );

  it( 'renders the dropdown with correct languages', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const dropdownLanguage = wrapper.find( 'DropdownLanguage' );
    const dropdownSemanticUI = dropdownLanguage.find( 'Dropdown' );
    const renderedLangItems = dropdownSemanticUI.find( 'DropdownItem' );
    const { languages } = dropdownLanguage.prop( 'data' );

    expect( dropdownSemanticUI.exists() ).toEqual( true );
    expect( renderedLangItems.length ).toEqual( languages.length );
    renderedLangItems.forEach( ( item, i ) => {
      expect( item.prop( 'value' ) ).toEqual( languages[i].value );
      expect( item.prop( 'text' ) ).toEqual( languages[i].text );
    } );
    expect( toJSON( dropdownLanguage ) ).toMatchSnapshot();
  } );

  it( 'making a selection calls `onChange`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const dropdown = wrapper.find( 'DropdownLanguage' );

    dropdown.simulate( 'change' );
    expect( props.onChange ).toHaveBeenCalled();
  } );
} );
