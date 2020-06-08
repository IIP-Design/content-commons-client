import { mount } from 'enzyme';

import SignedUrlImage from './SignedUrlImage';

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );

describe( '<SignedUrlImage>', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <SignedUrlImage /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'Sets the retrieved url as the background-image', () => {
    const wrapper = mount( <SignedUrlImage /> );

    const div = wrapper.find( 'div' );

    const style = div.prop( 'style' );

    expect( style.backgroundImage ).toEqual( 'url( https://example.jpg )' );
  } );

  it( 'renders a wrapped child element', () => {
    const wrapper = mount(
      <SignedUrlImage>
        <div id="child-test">Child element</div>
      </SignedUrlImage>,
    );

    const child = wrapper.find( '#child-test' );

    expect( child.exists() ).toEqual( true );
  } );

  it( 'component inherits passed in props', () => {
    const testClass = 'test';
    const wrapper = mount( <SignedUrlImage className={ testClass } /> );

    expect( wrapper.hasClass( testClass ) ).toEqual( true );
  } );
} );
