import { shallow } from 'enzyme';
import Focusable from './Focusable';

const Component = <Focusable>Some child content</Focusable>;

describe( '<Focusable />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders as a `span`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.name() ).toEqual( 'span' );
  } );

  it( 'has "focusable" class value', () => {
    const wrapper = shallow( Component );

    expect( wrapper.hasClass( 'focusable' ) ).toEqual( true );
  } );

  it( 'has default tabIndex prop value', () => {
    const wrapper = shallow( Component );

    expect( wrapper.prop( 'tabIndex' ) ).toEqual( 0 );
  } );

  it( 'sets custom tabIndex prop value', () => {
    const wrapper = shallow( Component );

    wrapper.setProps( { order: -1 } );
    expect( wrapper.prop( 'tabIndex' ) ).toEqual( -1 );
  } );

  it( 'renders children', () => {
    const wrapper = shallow( Component );

    expect( wrapper.children().text() )
      .toEqual( 'Some child content' );
  } );
} );
