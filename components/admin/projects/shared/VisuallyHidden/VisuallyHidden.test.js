import { shallow } from 'enzyme';
import VisuallyHidden from './VisuallyHidden';

const Component = <VisuallyHidden>Hidden Content</VisuallyHidden>;

describe( '<VisuallyHidden />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders as a `div`', () => {
    const wrapper = shallow( Component );
    expect( wrapper.name() ).toEqual( 'div' );
  } );

  it( 'has "hide-visually" class value', () => {
    const wrapper = shallow( Component );
    expect( wrapper.hasClass( 'hide-visually' ) ).toEqual( true );
  } );

  it( 'renders children', () => {
    const wrapper = shallow( Component );
    expect( wrapper.children().text() ).toEqual( 'Hidden Content' );
  } );
} );
