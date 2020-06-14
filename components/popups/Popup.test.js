import { mount } from 'enzyme';
import Popup from './Popup';

describe( '<Popup />', () => {
  const props = {
    title: 'The Title',
    children: <p>some child node</p>,
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <Popup { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the heading', () => {
    const heading = wrapper.find( '.ui.header' );

    expect( heading.name() ).toEqual( 'h2' );
    expect( heading.contains( props.title ) ).toEqual( true );
  } );

  it( 'renders the child component(s)', () => {
    expect( wrapper.contains( props.children ) ).toEqual( true );
  } );
} );
