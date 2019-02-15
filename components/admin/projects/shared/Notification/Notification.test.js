import { shallow } from 'enzyme';
import Notification from './Notification';

const Component = <Notification msg="A test message" />;

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
    expect( wrapper.children().text() )
      .toEqual( 'A test message' );
  } );

  it( 'renders as a `div` tag if passed as prop', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { el: 'div' } );
    expect( wrapper.name() ).toEqual( 'div' );
  } );

  it( 'applies default styles', () => {
    const wrapper = shallow( Component );
    expect( wrapper.prop( 'style' ) )
      .toEqual( {
        padding: '1em 1.5em',
        fontSize: '0.75em',
        backgroundColor: '#aee02d'
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
        color: '#fff'
      } );
  } );
} );
