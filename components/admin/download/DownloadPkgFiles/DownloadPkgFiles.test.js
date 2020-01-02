import { mount } from 'enzyme';
import { mocks } from 'components/admin/PackageEdit/mocks';
import DownloadPkgFiles from './DownloadPkgFiles';

jest.mock( 'static/icons/icon_download.svg', () => 'downloadIconSVG' );
jest.mock( 'lib/utils', () => ( {
  getS3Url: jest.fn( assetPath => (
    `https://s3-url.com/${assetPath}`
  ) ),
} ) );

// const props = {
//   files: mocks[0].result.data.pkg.documents,
//   instructions: 'Download Package File(s)',
//   isPreview: true
// };

// const Component = <DownloadPkgFiles { ...props } />;

describe( '<DownloadPkgFiles />, if isPreview', () => {
  const props = {
    files: mocks[0].result.data.pkg.documents,
    instructions: 'Download Package File(s)',
    isPreview: true
  };

  const Component = <DownloadPkgFiles { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the instructions', () => {
    const wrapper = mount( Component );
    expect( wrapper.contains( props.instructions ) ).toEqual( true );
  } );

  it( 'renders the correct className value for each item', () => {
    const wrapper = mount( Component );
    const itemsGroups = wrapper.find( 'ItemGroup' );

    expect( itemsGroups.length ).toEqual( props.files.length );
    itemsGroups.forEach( group => {
      expect( group.prop( 'className' ) ).toEqual( 'download-item preview' );
    } );
  } );

  it( 'renders the preview text for each item', () => {
    const wrapper = mount( Component );
    const itemsGroups = wrapper.find( 'ItemGroup' );
    const previewTxt = 'The link will be active after publishing.';

    expect( itemsGroups.length ).toEqual( props.files.length );
    itemsGroups.forEach( group => {
      expect( group.contains( previewTxt ) ).toEqual( true );
    } );
  } );

  it( 'renders the download text for each item', () => {
    const wrapper = mount( Component );
    const itemsGroups = wrapper.find( 'ItemGroup' );

    expect( itemsGroups.length ).toEqual( props.files.length );
    itemsGroups.forEach( ( group, i ) => {
      const { filename } = props.files[i];
      expect( group.contains( `Download ${filename}` ) ).toEqual( true );
    } );
  } );

  it( 'renders an <img /> for each item', () => {
    const wrapper = mount( Component );
    const itemsGroups = wrapper.find( 'ItemGroup' );

    expect( itemsGroups.length ).toEqual( props.files.length );
    itemsGroups.forEach( group => {
      const img = group.find( 'img' );
      expect( img.exists() ).toEqual( true );
      expect( img.props() ).toEqual( {
        src: 'downloadIconSVG',
        alt: 'download icon'
      } );
    } );
  } );

  it( 'renders the correct as, href, and download prop values', () => {
    const wrapper = mount( Component );
    const items = wrapper.find( 'Item' );

    expect( items.length ).toEqual( props.files.length );
    items.forEach( item => {
      expect( item.prop( 'as' ) ).toEqual( 'span' );
      expect( item.prop( 'href' ) ).toEqual( null );
      expect( item.prop( 'download' ) ).toEqual( null );
    } );
  } );
} );

describe( '<DownloadPkgFiles />, if !isPreview', () => {
  const props = {
    files: mocks[0].result.data.pkg.documents,
    instructions: 'Download Package File(s)',
    isPreview: false
  };

  const Component = <DownloadPkgFiles { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the instructions', () => {
    const wrapper = mount( Component );
    expect( wrapper.contains( props.instructions ) ).toEqual( true );
  } );

  it( 'renders the correct className value for each item', () => {
    const wrapper = mount( Component );
    const itemsGroups = wrapper.find( 'ItemGroup' );

    expect( itemsGroups.length ).toEqual( props.files.length );
    itemsGroups.forEach( group => {
      expect( group.prop( 'className' ) ).toEqual( 'download-item' );
    } );
  } );

  it( 'does not render the preview text for each item', () => {
    const wrapper = mount( Component );
    const itemsGroups = wrapper.find( 'ItemGroup' );
    const previewTxt = 'The link will be active after publishing.';

    expect( itemsGroups.length ).toEqual( props.files.length );
    itemsGroups.forEach( group => {
      expect( group.contains( previewTxt ) ).toEqual( false );
    } );
  } );

  it( 'renders the download text for each item', () => {
    const wrapper = mount( Component );
    const itemsGroups = wrapper.find( 'ItemGroup' );

    expect( itemsGroups.length ).toEqual( props.files.length );
    itemsGroups.forEach( ( group, i ) => {
      const { filename } = props.files[i];
      expect( group.contains( `Download ${filename}` ) ).toEqual( true );
    } );
  } );

  it( 'renders the correct as, href, and download prop values', () => {
    const wrapper = mount( Component );
    const items = wrapper.find( 'Item' );
    const s3Bucket = 'https://s3-url.com';

    expect( items.length ).toEqual( props.files.length );
    items.forEach( ( item, i ) => {
      const { filename, url: assetPath } = props.files[i];
      expect( item.prop( 'as' ) ).toEqual( 'a' );
      expect( item.prop( 'href' ) ).toEqual( `${s3Bucket}/${assetPath}` );
      expect( item.prop( 'download' ) ).toEqual( filename );
    } );
  } );
} );

describe( '<DownloadPkgFiles />, if there are no files', () => {
  const props = {
    files: [],
    instructions: 'Download Package File(s)',
    isPreview: false
  };

  const Component = <DownloadPkgFiles { ...props } />;

  it( 'renders the "No files to download" message', () => {
    const wrapper = mount( Component );
    const msg = 'There are no files available for download at this time.';

    expect( wrapper.contains( msg ) ).toEqual( true );
  } );

  it( 'does not render any items', () => {
    const wrapper = mount( Component );
    const itemsGroups = wrapper.find( 'ItemGroup' );

    expect( itemsGroups.length ).toEqual( 0 );
  } );
} );

describe( '<DownloadPkgFiles />, if !props.files', () => {
  const props = {
    files: undefined,
    instructions: 'Download Package File(s)',
    isPreview: false
  };

  const Component = <DownloadPkgFiles { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the instructions', () => {
    const wrapper = mount( Component );
    expect( wrapper.contains( props.instructions ) ).toEqual( true );
  } );

  it( 'does not render any items', () => {
    const wrapper = mount( Component );
    const itemGroups = wrapper.find( 'ItemGroup' );

    expect( itemGroups.length ).toEqual( 0 );
  } );
} );
