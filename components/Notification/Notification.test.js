import { shallow } from 'enzyme';
import Notification from './Notification';

const props = {
  msg: 'A test message',
  show: false,
  icon: true,
};

const Component = <Notification { ...props } />;

describe( '<Notification />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders as a default `p` tag', () => {
    const wrapper = shallow( Component );
    expect( wrapper.name() ).toEqual( 'p' );
  } );

  it( 'renders the notification message', () => {
    const wrapper = shallow( Component );
    expect( wrapper.contains( props.msg ) ).toEqual( true );
  } );

  it( 'renders as a `div` tag if passed as prop', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { el: 'div' } );
    expect( wrapper.name() ).toEqual( 'div' );
  } );

  it( 'applies default styles if !props.show', () => {
    const wrapper = shallow( Component );
    expect( wrapper.prop( 'style' ) )
      .toEqual( {
        padding: '1em 1.5em',
        fontSize: '0.75em',
        backgroundColor: '#aee02d',
        display: 'none'
      } );
  } );

  it( 'applies default styles if props.show', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { show: true } );
    expect( wrapper.prop( 'style' ) )
      .toEqual( {
        padding: '1em 1.5em',
        fontSize: '0.75em',
        backgroundColor: '#aee02d',
        display: 'block'
      } );
  } );

  it( 'applies custom styles if passed as prop', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( {
      customStyles: {
        color: '#fff',
        fontSize: '2em',
        backgroundColor: 'blue'
      }
    } );
    expect( wrapper.prop( 'style' ) )
      .toEqual( {
        padding: '1em 1.5em',
        fontSize: '2em',
        backgroundColor: 'blue',
        color: '#fff',
        display: 'none'
      } );
  } );

  it( 'applies correct style rule to Icon if props.icon', () => {
    const wrapper = shallow( Component );
    const icon = wrapper.find( 'Icon' );
    expect( icon.prop( 'style' ) ).toEqual( { display: 'inline-block' } );
  } );

  it( 'applies correct style rule to Icon if !props.icon', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { icon: false } );
    const icon = wrapper.find( 'Icon' );
    expect( icon.prop( 'style' ) ).toEqual( { display: 'none' } );
  } );

  it( 'applies custom className values', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { classes: 'one two' } );
    expect( wrapper.prop( 'className' ) ).toEqual( 'one two' );
  } );
} );
