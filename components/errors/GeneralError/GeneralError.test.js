import { shallow } from 'enzyme';
import GeneralError from './GeneralError';

jest.mock( 'static/icons/icon_alert.svg', () => 'iconAlert' );

const props = {
  children: <span>just some child node</span>,
  el: 'div',
  icon: true,
  msg: 'An error occurred',
  style: {
    color: 'blue',
  },
};

const Component = <GeneralError { ...props } />;

describe( '<GeneralError />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.hasClass( 'general-error' ) ).toEqual( true );
  } );

  it( 'accepts custom styling', () => {
    const wrapper = shallow( Component );

    expect( wrapper.prop( 'style' ) ).toEqual( props.style );
  } );

  it( 'renders the alert icon & error message', () => {
    const wrapper = shallow( Component );
    const iconWrapper = wrapper.find( '.icon' );
    const img = <img src="iconAlert" alt="alert icon" />;

    expect( iconWrapper.exists() ).toEqual( true );
    expect( iconWrapper.contains( img ) ).toEqual( true );
    expect( iconWrapper.contains( props.msg ) ).toEqual( true );
  } );

  it( 'does not render the alert icon if the icon prop is false', () => {
    const noIconProps = { ...props, icon: false };
    const wrapper = shallow( <GeneralError { ...noIconProps } /> );
    const iconWrapper = wrapper.find( '.icon' );
    const img = <img src="iconAlert" alt="alert icon" />;

    expect( iconWrapper.contains( img ) ).toEqual( false );
  } );

  it( 'renders child node(s)', () => {
    const wrapper = shallow( Component );

    expect( wrapper.contains( props.children ) ).toEqual( true );
  } );
} );
