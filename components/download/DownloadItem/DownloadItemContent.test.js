import { mount } from 'enzyme';
import DownloadItemContent from './DownloadItemContent';

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );

const props = {
  isAdminPreview: false,
  srcUrl: '/link/to/download',
  hoverText: 'Here is text to display on hover',
};

const Component = (
  <DownloadItemContent { ...props }>
    <p>Download File</p>
  </DownloadItemContent>
);

describe( '<DownloadItemContent', () => {
  const wrapper = mount( Component );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the srcUrl', () => {
    expect( wrapper.prop( 'srcUrl' ) ).toEqual( props.srcUrl );
  } );

  it( 'displays the hover text', () => {
    expect( wrapper.prop( 'hoverText' ) ).toEqual( props.hoverText );
    expect( wrapper.find( '.item-hover' ).text() ).toEqual( props.hoverText );
  } );

  it( 'displays the content', () => {
    expect( wrapper.find( 'p' ).text() ).toEqual( 'Download File' );
  } );

  it( 'renders preview text on admin preview', () => {
    const previewProps = { ...props, isAdminPreview: true };
    const PreviewComponent = <DownloadItemContent { ...previewProps } />;
    const previewWrapper = mount( PreviewComponent );
    const previewText = 'The link will be active after publishing.';

    const previewTextElem = previewWrapper.find( '.preview-text' );

    expect( previewTextElem.exists() ).toEqual( true );
    expect( previewTextElem.text() ).toEqual( previewText );
  } );
} );
