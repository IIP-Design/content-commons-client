import { mount } from 'enzyme';
import DownloadThumbnailsAndOtherFiles from '../DownloadThumbnailsAndOtherFiles';
import { mockItem } from '../../mocks';
import { getFileDownloadUrl, getFileNameFromUrl } from 'lib/utils';

jest.mock(
  'next/config',
  () => () => ( {
    publicRuntimeConfig: {
      REACT_APP_PUBLIC_API: 'https://amgov-publisher-dev.s3.amazonaws.com',
    },
  } ),
);
jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );

describe( '<DownloadThumbnailsAndOtherFiles />', () => {
  const props = {
    item: mockItem,
  };
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <DownloadThumbnailsAndOtherFiles { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'passes the correct data to the DownloadItems', () => {
    const downloadItems = wrapper.find( 'DownloadItemContent' );
    const { item } = props;
    const thumbnails = item.units.reduce( ( acc, unit ) => {
      acc.push( {
        thumbnail: unit.thumbnail,
        language: unit.language,
      } );

      return acc;
    }, [] );
    const supportFiles = item.supportFiles.filter( file => file.supportFileType !== 'srt' && file.supportFileType !== 'vtt' );
    const allOtherFiles = [...thumbnails, ...supportFiles];

    expect( downloadItems.length ).toEqual( allOtherFiles.length );
    downloadItems.forEach( ( downloadItem, i ) => {
      const file = allOtherFiles[i];
      const title = downloadItem.find( '.item-content__title' );
      const hover = downloadItem.find( '.item-hover' );
      const src = file.thumbnail || file.srcUrl;
      const fileName = getFileNameFromUrl( src );
      const fileType = file.supportFileType ? `${file.supportFileType} file` : 'Thumbnail';
      const helperText = `Download ${file.language.display_name} ${fileType}`;
      const srcUrl = getFileDownloadUrl( src, fileName );

      expect( title.text() ).toEqual( helperText );
      expect( hover.text() ).toEqual( helperText );
      expect( downloadItem.prop( 'srcUrl' ) ).toEqual( srcUrl );
    } );
  } );
} );
