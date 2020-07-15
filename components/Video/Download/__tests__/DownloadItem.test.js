import { mount } from 'enzyme';
import DownloadItem from '../DownloadItem';

const mockSignedUrl = 'https://example-asset-url-signed.jpg';
jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: mockSignedUrl } ) ) );

const props = {
  download: 'mock-download.mp4',
  header: 'Mock header text',
  hover: 'Mock hover text',
  url: 'https://example-asset-url.jpg',
};

const child = <div>Mock Child</div>;

describe( '<DownloadItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <DownloadItem { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders link to the signed URL', () => {
    const wrapper = mount( <DownloadItem { ...props } /> );

    const item = wrapper.find( 'Item' );
    const anchor = item.find( 'a' );

    expect( anchor.exists() ).toEqual( true );
    expect( anchor.prop( 'href' ) ).toEqual( mockSignedUrl );
    expect( anchor.prop( 'download' ) ).toEqual( props.download );
  } );

  it( 'renders header with provided text', () => {
    const wrapper = mount( <DownloadItem { ...props } /> );

    const header = wrapper.find( 'ItemHeader' );

    expect( header.exists() ).toEqual( true );
    expect( header.contains( props.header ) ).toEqual( true );
  } );

  it( 'renders hover with provided text', () => {
    const wrapper = mount( <DownloadItem { ...props } /> );

    const hover = wrapper.find( '.item_hover' );

    expect( hover.exists() ).toEqual( true );
    expect( hover.contains( props.hover ) ).toEqual( true );
  } );

  it( 'renders child if passed in', () => {
    const wrapper = mount(
      <DownloadItem { ...props }>
        { child }
      </DownloadItem>,
    );

    expect( wrapper.contains( child ) ).toEqual( true );
  } );
} );
