import { mount } from 'enzyme';
import PreviewLink from './PreviewLink';

describe( '<PreviewLink />', () => {
  let Component;
  let wrapper;

  const props = {
    content: 'Preview',
    disabled: false,
    url: '/admin/package/playbook/123/preview',
  };

  beforeEach( () => {
    Component = <PreviewLink { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders a link with correct href when enabled', () => {
    const link = wrapper.find( 'a[href]' );
    const placeholderLink = wrapper.find( '.placeholder' );

    expect( link.prop( 'href' ) ).toEqual( props.url );
    expect( placeholderLink.exists() ).toEqual( false );
  } );

  it( 'renders a placeholder link if disabled', () => {
    wrapper.setProps( { disabled: true } );
    const link = wrapper.find( 'a[href]' );
    const placeholderLink = wrapper.find( '.placeholder' );

    expect( link.exists() ).toEqual( false );
    expect( placeholderLink.contains( '(disabled link)' ) ).toEqual( true );
  } );
} );
