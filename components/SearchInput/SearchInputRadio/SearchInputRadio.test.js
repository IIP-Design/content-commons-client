import { mount } from 'enzyme';
import SearchInputRadio from './SearchInputRadio';

describe( '<SearchInputRadio />', () => {
  let Component;
  let wrapper;
  let searchInputRadio;

  const props = {
    config: {
      checked: true,
      label: 'Articles, Graphics, Videos',
      name: 'radioGroup',
      onChange: jest.fn(),
      value: 'multiple',
    },
  };

  beforeEach( () => {
    Component = <SearchInputRadio { ...props } />;
    wrapper = mount( Component );
    searchInputRadio = wrapper.find( 'SearchInputRadio' );
  } );

  it( 'renders without crashing', () => {
    expect( searchInputRadio.exists() ).toEqual( true );
  } );

  it( 'renders matching htmlFor and id values', () => {
    const label = searchInputRadio.find( 'label' );
    const input = searchInputRadio.find( 'input' );
    const { value } = props.config;

    expect( label.prop( 'htmlFor' ) ).toEqual( value );
    expect( input.prop( 'id' ) ).toEqual( value );
  } );

  it( 'renders correct name, value, and checked attributes', () => {
    const input = searchInputRadio.find( 'input' );
    const { checked, name, value } = props.config;

    expect( input.prop( 'checked' ) ).toEqual( checked );
    expect( input.prop( 'name' ) ).toEqual( name );
    expect( input.prop( 'value' ) ).toEqual( value );
  } );

  it( 'renders the .radio-control', () => {
    const radioControl = searchInputRadio.find( '.radio-control' );

    expect( radioControl.exists() ).toEqual( true );
  } );

  it( 'renders the .radio-label', () => {
    const radioLabel = searchInputRadio.find( '.radio-label' );

    expect( radioLabel.text() ).toEqual( props.config.label );
  } );
} );
