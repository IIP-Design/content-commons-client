import { mount } from 'enzyme';
import ModalItem from './ModalItem';

describe( '<ModalItem />, for LTR text direction', () => {
  const props = {
    className: 'custom-class-value',
    headline: 'The Headline',
    children: <p>a child component</p>,
    subHeadline: 'a subheadline',
    textDirection: 'LTR',
    lang: 'en',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalItem { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className and lang values', () => {
    const container = wrapper.find( 'ModalItem > div' );
    const values = `modal ${props.textDirection} ${props.className}`;

    expect( container.hasClass( values ) ).toEqual( true );
    expect( container.prop( 'lang' ) ).toEqual( props.lang );
  } );

  it( 'renders the modal headline and subheadline', () => {
    const headline = wrapper.find( '.modal_headline' );
    const subHeadline = headline.find( '.modal_subheadline' );

    expect( headline.exists() ).toEqual( true );
    expect( headline.name() ).toEqual( 'h1' );
    expect( headline.contains( props.headline ) ).toEqual( true );
    expect( subHeadline.exists() ).toEqual( true );
    expect( subHeadline.name() ).toEqual( 'span' );
    expect( subHeadline.text() ).toEqual( props.subHeadline );
  } );

  it( 'renders the child component(s)', () => {
    const container = wrapper.find( 'ModalItem > div' );

    expect( container.contains( props.children ) ).toEqual( true );
  } );
} );

describe( '<ModalItem />, for RTL text direction', () => {
  const props = {
    className: 'custom-class-value',
    headline: 'The Headline',
    children: <p>a child component</p>,
    subHeadline: 'a subheadline',
    textDirection: 'RTL',
    lang: 'ar',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalItem { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className and lang values', () => {
    const container = wrapper.find( 'ModalItem > div' );
    const values = `modal ${props.textDirection} ${props.className}`;

    expect( container.hasClass( values ) ).toEqual( true );
    expect( container.prop( 'lang' ) ).toEqual( props.lang );
  } );
} );
