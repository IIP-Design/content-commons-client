import { shallow } from 'enzyme';

import Footer from './Footer';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    PRESS_GUIDANCE_DB_URL: 'press-guidances'
  }
} ) );

jest.mock( 'context/authContext', () => ( {
  useAuth: jest
    .fn( () => ( { user: null } ) )
    .mockImplementationOnce( () => ( { user: true } ) )
} ) );

describe( '<Footer />', () => {
  const pressLinkText = [expect.stringMatching( 'Archived Press Guidance' )];

  it( 'renders proper list of links when user is logged in', () => {
    const wrapper = shallow( <Footer /> );

    const list = wrapper.find( 'ListItem' );

    const links = wrapper.find( 'a.footer_link' ).getElements();
    const linkTextArr = links.map( link => link.props.children );

    expect( list ).toHaveLength( 4 );
    expect( linkTextArr ).toEqual(
      expect.arrayContaining( pressLinkText )
    );
  } );

  it( 'renders proper list of links when user is logged out', () => {
    const wrapper = shallow( <Footer /> );

    const list = wrapper.find( 'ListItem' );

    const links = wrapper.find( 'a.footer_link' ).getElements();
    const linkTextArr = links.map( link => link.props.children );

    expect( list ).toHaveLength( 3 );
    expect( linkTextArr ).toEqual(
      expect.not.arrayContaining( pressLinkText )
    );
  } );
} );
