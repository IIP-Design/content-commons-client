import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import DropdownSupportFileUse, { SUPPORT_FILE_USES_QUERY } from './DropdownSupportFileUse';

const props = {
  id: 'm123',
  name: 'fileUse',
  onChange: jest.fn(),
  value: 'th89',
  fluid: true,
  required: true
};

const mocks = [
  {
    request: {
      query: SUPPORT_FILE_USES_QUERY,
      variables: { orderBy: 'name_ASC' }
    },
    result: {
      data: {
        uses: [
          { value: 'th89', text: 'Thumbnail/Cover Image' },
          { value: 'em92', text: 'Email Graphic' }
        ]
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <DropdownSupportFileUse { ...props } />
  </MockedProvider>
);

describe( '<DropdownSupportFileUse />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'DropdownSupportFileUse' );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.contains( 'Loading file use...' ) ).toEqual( true );
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: SUPPORT_FILE_USES_QUERY,
          variables: { orderBy: 'name_ASC' }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <DropdownSupportFileUse { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const dropdown = wrapper.find( 'DropdownSupportFileUse' );

    expect( dropdown.contains( 'Loading error...' ) ).toEqual( true );
  } );

  it( 'renders the dropdown with correct uses', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const dropdownUse = wrapper.find( 'DropdownSupportFileUse' );
    const dropdownSemanticUI = dropdownUse.find( 'Dropdown' );
    const renderedUseItems = dropdownSemanticUI.find( 'DropdownItem' );
    const { uses } = dropdownUse.prop( 'data' );

    expect( dropdownSemanticUI.exists() ).toEqual( true );
    expect( renderedUseItems.length ).toEqual( uses.length );
    renderedUseItems.forEach( ( item, i ) => {
      expect( item.prop( 'value' ) ).toEqual( uses[i].value );
      expect( item.prop( 'text' ) ).toEqual( uses[i].text );
    } );
    expect( toJSON( dropdownUse ) ).toMatchSnapshot();
  } );

  it( 'making a selection calls `onChange`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const dropdown = wrapper.find( 'DropdownSupportFileUse' );

    dropdown.simulate( 'change' );
    expect( props.onChange ).toHaveBeenCalled();
  } );
} );
