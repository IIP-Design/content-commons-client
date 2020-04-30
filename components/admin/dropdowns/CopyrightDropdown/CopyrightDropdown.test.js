import { mount } from 'enzyme';
import sortBy from 'lodash/sortBy';
import CopyrightDropdown, { data } from './CopyrightDropdown';

describe( '<CopyrightDropdown />', () => {
  const props = {
    id: '123xyz',
    label: 'Copyright'
  };

  const Component = <CopyrightDropdown { ...props } />;

  let wrapper;
  let dropdown;

  beforeEach( () => {
    wrapper = mount( Component );
    dropdown = wrapper.find( 'CopyrightDropdown' );
  } );

  it( 'renders without crashing', () => {
    expect( dropdown.exists() ).toEqual( true );
  } );

  it( 'renders the correct dropdown options', () => {
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const options = sortBy( data, obj => obj.name )
      .map( obj => ( {
        key: obj.id,
        text: obj.name,
        value: obj.name
      } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( data.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', () => {
    const dropdownDiv = wrapper.find( 'Dropdown div[name="copyright"]' );
    const label = wrapper.find( 'label' );

    expect( dropdownDiv.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
