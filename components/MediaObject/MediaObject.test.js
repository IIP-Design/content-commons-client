import { mount } from 'enzyme';
import MediaObject from './MediaObject';

const props = {
  body: <p>the body content</p>,
  className: 'just-a-custom-className',
  img: {
    src: 'https://someurl.com/2020/01/filename.png',
    alt: 'some alt text',
    className: 'yet-another-custom-className',
    style: {
      height: '30px',
      width: '30px',
    },
  },
  style: {
    color: '#ffffff',
    backgroundColor: '#112e51',
  },
};

const Component = <MediaObject { ...props } />;

describe( '<MediaObject />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders correct Element and props', () => {
    const wrapper = mount( Component );
    const mediaObject = wrapper.find( '.media' );

    expect( mediaObject.name() ).toEqual( 'div' );
    expect( mediaObject.prop( 'className' ) )
      .toEqual( `media ${props.className}` );
    expect( mediaObject.prop( 'style' ) ).toEqual( props.style );
  } );

  it( 'renders the img and correct props', () => {
    const wrapper = mount( Component );
    const mediaFigure = wrapper.find( '.media-figure' );

    expect( mediaFigure.name() ).toEqual( 'img' );
    expect( mediaFigure.props() ).toEqual( {
      src: props.img.src,
      alt: props.img.alt,
      className: `media-figure ${props.img.className}`,
      style: props.img.style,
    } );
  } );

  it( 'renders the body', () => {
    const wrapper = mount( Component );
    const mediaObject = wrapper.find( '.media' );

    expect( mediaObject.contains( props.body ) ).toEqual( true );
  } );
} );
