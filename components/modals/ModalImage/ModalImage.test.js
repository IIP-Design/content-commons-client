import { mount } from 'enzyme';

import ModalImage from './ModalImage';

const thumbnail = 'http://example.com/my.jpg';
const mockSignedUrl = 'https://example-asset-url-signed.jpg';
const thumbnailMeta = {
  alt: 'Mock alternative text',
  caption: 'Mock caption text',
};

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: mockSignedUrl } ) ) );

describe( '<ModalImage />', () => {
  const wrapper = mount( <ModalImage thumbnail={ thumbnail } thumbnailMeta={ thumbnailMeta } /> );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders an img with the provided src and alt attributes', () => {
    const img = wrapper.find( 'img' );

    expect( img.exists() ).toEqual( true );
    expect( img.prop( 'src' ) ).toEqual( mockSignedUrl );
    expect( img.prop( 'alt' ) ).toEqual( thumbnailMeta.alt );
  } );

  it( 'renders a figcaption with the provided caption', () => {
    const figcaption = wrapper.find( 'figcaption' );

    expect( figcaption.exists() ).toEqual( true );
    expect( figcaption.contains( thumbnailMeta.caption ) ).toEqual( true );
  } );
} );
