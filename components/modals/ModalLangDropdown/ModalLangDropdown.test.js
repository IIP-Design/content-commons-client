import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { item } from './mocks';
import ModalLangDropdown from './ModalLangDropdown';

const props = {
  item,
  selected: 'English',
  handleLanguageChange: jest.fn(),
};

const singleProps = {
  ...props,
  item: {
    ...props.item,
    units: props.item.units.filter(
      u => u.language.display_name === props.selected,
    ),
  },
};

const noUnitsProps = {
  ...props,
  item: { ...props.items, units: [] },
};

const languages = [
  { key: 'zh-cn', value: 'Chinese (Simplified)', text: 'Chinese (Simplified)' },
  { key: 'en-us', value: 'English', text: 'English' },
  { key: 'fr-fr', value: 'French', text: 'French' },
  { key: 'ru-ru', value: 'Russian', text: 'Russian' },
  { key: 'es-es', value: 'Spanish', text: 'Spanish' },
];

const Component = <ModalLangDropdown { ...props } />;
const SingleItemComponent = <ModalLangDropdown { ...singleProps } />;
const NoUnitsItemComponent = <ModalLangDropdown { ...noUnitsProps } />;

describe( '<ModalLangDropdown />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'sets the correct languages for the Dropdown', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'Dropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );

    expect( dropdown.prop( 'options' ) ).toEqual( languages );
    expect( dropdownItems.length ).toEqual( languages.length );
  } );

  it( 'clicking the Dropdown opens the Dropdown', () => {
    const wrapper = mount( Component );
    const dropdown = () => wrapper.find( 'Dropdown' );

    // initially closed
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron down' );

    // open the Dropdown
    dropdown().simulate( 'click' );
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron up' );
  } );

  it( 'selecting another language closes the Dropdown and calls handleLanguageChange', () => {
    const wrapper = mount( Component );
    const dropdown = () => wrapper.find( 'Dropdown' );
    const e = {};
    const data = { value: 'French' };

    // open the Dropdown
    dropdown().simulate( 'click' );
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron up' );

    /**
     * Invoke `onChange` directly since it takes multiple arguments
     * @see https://github.com/airbnb/enzyme/issues/808
     *
     * Wrap in `act` to address `not wrapped in act(...)`
     * `console.error`
     */
    act( () => {
      dropdown().prop( 'onChange' )( e, data );
    } );
    wrapper.update();
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron down' );
    expect( props.handleLanguageChange ).toHaveBeenCalledWith( data.value );
  } );

  it( 'renders a single language with no Dropdown if there is only one language unit', () => {
    const wrapper = mount( SingleItemComponent );
    const dropdown = wrapper.find( 'Dropdown' );

    expect( dropdown.exists() ).toEqual( false );
    expect( wrapper.contains( props.selected ) ).toEqual( true );
  } );

  it( 'renders a single language with no Dropdown if there are no language units', () => {
    const wrapper = mount( NoUnitsItemComponent );
    const dropdown = wrapper.find( 'Dropdown' );

    expect( dropdown.exists() ).toEqual( false );
    expect( wrapper.contains( props.selected ) ).toEqual( true );
  } );
} );
