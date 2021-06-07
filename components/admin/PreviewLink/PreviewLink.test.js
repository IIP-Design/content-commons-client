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
    const link = wrapper.find( 'a' );
    const span = wrapper.find( 'span' );

    expect( link.prop( 'href' ) ).toEqual( props.url );
    expect( span.exists() ).toEqual( false );
  } );

  it( 'renders a span when disabled', () => {
    wrapper.setProps( { disabled: true } );
    const link = wrapper.find( 'a' );
    const span = wrapper.find( 'span' );

    expect( link.exists() ).toEqual( false );
    expect( span.contains( '(disabled)' ) ).toEqual( true );
  } );
} );
