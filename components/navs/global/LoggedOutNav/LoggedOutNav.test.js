import { mount } from 'enzyme';
import LoggedOutNav from './LoggedOutNav';

jest.mock(
  '../HamburgerIcon',
  () => function HamburgerIcon() { return ''; },
);

describe( '<LoggedOutNav />', () => {
  const props = {
    mobileMenuVisible: false,
    toggleMobileMenu: jest.fn(),
    keyUp: jest.fn(),
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <LoggedOutNav { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the ul', () => {
    const unorderedList = wrapper.find( 'ul' );

    expect( unorderedList.exists() ).toEqual( true );
    expect( unorderedList.prop( 'className' ) )
      .toEqual( 'ui nav_loggedout menu' );
  } );

  it( 'renders the correct menu items', () => {
    const items = wrapper.find( 'MenuItem' );
    const menuItems = [
      {
        name: 'about',
        to: '/about',
        label: 'About',
      },
      {
        name: 'help',
        to: '/help',
        label: 'Help',
      },
      {
        name: 'documentation',
        to: '/documentation',
        label: 'Documentation',
      },
      {
        name: 'login',
        to: '/login',
        label: 'Login',
      },
    ];

    items.forEach( ( item, i ) => {
      const link = item.find( 'a' );
      const { label, name, to } = menuItems[i];

      expect( item.prop( 'name' ) ).toEqual( name );
      expect( link.contains( label ) ).toEqual( true );
      expect( link.prop( 'href' ) ).toEqual( to );
    } );
  } );

  it( 'renders the feedback link', () => {
    const feedback = wrapper.find( 'a.feedback' );

    expect( feedback.exists() ).toEqual( true );
    expect( feedback.props() ).toEqual( {
      href: 'https://goo.gl/forms/9cJ3IBHH9QTld2Mj2',
      target: '_blank',
      className: 'feedback',
      rel: 'noopener noreferrer',
      children: 'Feedback',
    } );
  } );
} );
