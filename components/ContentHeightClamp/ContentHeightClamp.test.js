import { mount } from 'enzyme';
import ContentHeightClamp from './ContentHeightClamp';

const props = {
  children: <p>child node</p>,
  className: 'excerpt'
};

describe( '<ContentHeightClamp />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ContentHeightClamp { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'has the correct props', () => {
    expect( wrapper.props() ).toEqual( {
      ...props,
      el: 'div',
      maxHeight: 144,
      style: {}
    } );
  } );

  it( 'renders children', () => {
    expect( wrapper.children().length ).toEqual( 1 );
    expect( wrapper.contains( props.children ) ).toEqual( true );
  } );

  it( 'renders the correct className values if < props.maxHeight', () => {
    const div = wrapper.find( 'div' );

    // jsdom doesn't do rendering, so height will always be 0
    expect( div.hasClass( 'height-clamp' ) ).toEqual( true );
    expect( div.hasClass( props.className ) ).toEqual( true );
    expect( div.hasClass( 'unclamped' ) ).toEqual( true );
    expect( div.hasClass( 'clamped' ) ).toEqual( false );
  } );

  it.skip( 'renders the correct className values if > props.maxHeight - TBD', () => {
    const div = wrapper.find( 'div' );
    // jsdom doesn't do rendering, so height will always be 0
    // div.getBoundingClientRect = jest.fn( () => ( { height: 200 } ) );
    // console.log( div.getBoundingClientRect() );
    // expect( document.documentElement.clientHeight ).toEqual( 200 );
    expect( div.hasClass( 'height-clamp' ) ).toEqual( true );
    expect( div.hasClass( props.className ) ).toEqual( true );
    expect( div.hasClass( 'unclamped' ) ).toEqual( false );
    expect( div.hasClass( 'clamped' ) ).toEqual( true );
  } );
} );
