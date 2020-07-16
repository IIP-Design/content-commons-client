import { mount } from 'enzyme';
import DownloadTranscript from '../DownloadTranscript';
import { mockItem } from '../../mocks';

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );

describe( '<DownloadTranscript />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <DownloadTranscript item={ mockItem } /> );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'passes the correct data to the DownloadItem', () => {
    const expectedHeader = 'Download English Transcript';
    const expectedHover = 'Download English Transcript';
    const expectedUrl = 'https://amgov-publisher-dev.s3.amazonaws.com/2020/0788lwfvaep7/c9a4533157a9797a1ecee6ca2d8c382c.pdf';

    const wrapper = mount( <DownloadTranscript item={ mockItem } /> );

    const downloadItem = wrapper.find( 'DownloadItemContent' );
    expect( downloadItem.exists() ).toEqual( true );
    expect( downloadItem.find( '.item-content__title' ).text() ).toEqual( expectedHeader );
    expect( downloadItem.find( '.item-hover' ).text() ).toEqual( expectedHover );
    expect( downloadItem.prop( 'srcUrl' ) ).toEqual( expectedUrl );
  } );
} );
