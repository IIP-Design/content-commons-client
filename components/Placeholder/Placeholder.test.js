import { shallow } from 'enzyme';
import Placeholder from './Placeholder';

const Component = <Placeholder />;

describe( '<Placeholder />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders as an `li` by default', () => {
    const wrapper = shallow( Component );

    expect( wrapper.name() ).toEqual( 'li' );
  } );

  it( 'renders a custom parent element via props', () => {
    const wrapper = shallow( Component );

    wrapper.setProps( { parentEl: 'p' } );
    expect( wrapper.name() ).toEqual( 'p' );
  } );

  it( 'has "placeholder" class value', () => {
    const wrapper = shallow( Component );

    expect( wrapper.hasClass( 'placeholder' ) )
      .toEqual( true );
  } );

  it( 'has an empty `{}` for the style prop by default', () => {
    const wrapper = shallow( Component );

    expect( wrapper.prop( 'style' ) ).toEqual( {} );
  } );

  it( 'receives custom parentStyles', () => {
    const wrapper = shallow( Component );

    wrapper.setProps( {
      parentStyles: { marginBottom: '2em' },
    } );
    expect( wrapper.prop( 'style' ) )
      .toEqual( { marginBottom: '2em' } );
  } );

  it( 'renders a single child `div` by default', () => {
    const wrapper = shallow( Component );

    expect( wrapper.children().name() )
      .toEqual( 'div' );
  } );

  it( 'renders a custom child element via props', () => {
    const wrapper = shallow( <Placeholder childEl="span" /> );

    expect( wrapper.children().name() ).toEqual( 'span' );
  } );

  it( 'renders default styles for the child element', () => {
    const wrapper = shallow( Component );
    const childEl = wrapper.children();

    expect( childEl.prop( 'style' ) )
      .toEqual( {
        height: '0.875em',
        width: 'auto',
        marginBottom: '0.625em',
        backgroundColor: '#d6d7d9',
      } );
  } );

  it( 'receives custom childStyles', () => {
    const wrapper = shallow(
      <Placeholder childStyles={ { item: { color: 'red' } } } />,
    );

    expect( wrapper.children().prop( 'style' ) )
      .toEqual( {
        height: '0.875em',
        width: 'auto',
        marginBottom: '0.625em',
        backgroundColor: '#d6d7d9',
        color: 'red',
      } );
  } );

  it( 'renders multiple child elements', () => {
    const wrapper = shallow(
      <Placeholder
        childStyles={ {
          item1: {
            color: 'red',
          },
          item2: {
            color: 'green',
          },
        } }
      />,
    );

    expect( wrapper.children() ).toHaveLength( 2 );
  } );
} );
