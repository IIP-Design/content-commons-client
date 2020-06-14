import { mount } from 'enzyme';
import ModalDescription from './ModalDescription';

describe( '<ModalDescription />, for a plain text description', () => {
  const props = {
    description: 'yet another plain text description',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalDescription { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className values', () => {
    const parentEl = wrapper.find( 'section' );
    const value = 'modal_section modal_section--description';

    expect( parentEl.exists() ).toEqual( true );
    expect( parentEl.hasClass( value ) ).toEqual( true );
  } );

  it( 'renders the plain text description', () => {
    const el = wrapper.find( '.modal_description_text' );

    expect( el.exists() ).toEqual( true );
    expect( el.name() ).toEqual( 'p' );
    expect( el.contains( props.description ) ).toEqual( true );
  } );
} );

describe( '<ModalDescription />, for an html description', () => {
  const props = {
    description: {
      html: '<p>just another html description</p>',
    },
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalDescription { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className values', () => {
    const parentEl = wrapper.find( 'section' );
    const value = 'modal_section modal_section--description';

    expect( parentEl.exists() ).toEqual( true );
    expect( parentEl.hasClass( value ) ).toEqual( true );
  } );

  it( 'renders the html description', () => {
    const el = wrapper.find( 'div.modal_description_text' );
    const parsedHtml = wrapper.find( 'ParsedHtml' );

    expect( el.exists() ).toEqual( true );
    expect( parsedHtml.prop( 'value' ) ).toEqual( props.description.html );
    expect( parsedHtml.contains( 'just another html description' ) )
      .toEqual( true );
  } );
} );
