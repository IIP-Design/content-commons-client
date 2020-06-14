import { mount } from 'enzyme';
import ModalText from './ModalText';

describe( '<ModalText />', () => {
  const props = {
    textContent: 'some text',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalText { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className values', () => {
    const container = wrapper.find( 'section' );
    const values = 'modal_section modal_section--textContent';

    expect( container.hasClass( values ) ).toEqual( true );
  } );

  it( 'renders the text', () => {
    const textContainer = wrapper.find( '.textContent' );

    expect( textContainer.text() ).toEqual( props.textContent );
  } );
} );
