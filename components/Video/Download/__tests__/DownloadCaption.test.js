import { mount } from 'enzyme';
import DownloadCaption from '../DownloadCaption';
import { mockItem } from '../../mocks';

jest.mock(
  'next/config',
  () => () => ( {
    publicRuntimeConfig: {
      REACT_APP_PUBLIC_API: 'https://amgov-publisher-dev.s3.amazonaws.com',
    },
  } ),
);

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );

describe( '<DownloadCaption />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <DownloadCaption item={ mockItem } /> );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'passes the correct data to the DownloadItem', () => {
    const expectedHeader = 'Download English SRT';
    const expectedHover = 'Download English SRT';
    const expectedUrl = 'https://amgov-publisher-dev.s3.amazonaws.com/v1/task/download/eyJrZXkiOiJodHRwczovL2FtZ292LXB1Ymxpc2hlci1kZXYuczMuYW1hem9uYXdzLmNvbS8yMDIwLzA3ODhsd2Z2YWVwNy9jOWE0NTMzMTU3YTk3OTdhMWVjZWU2Y2EyZDhjMzgyYy5zcnQiLCJmaWxlbmFtZSI6ImM5YTQ1MzMxNTdhOTc5N2ExZWNlZTZjYTJkOGMzODJjLnNydCJ9';

    const wrapper = mount( <DownloadCaption item={ mockItem } /> );

    const downloadItem = wrapper.find( 'DownloadItemContent' );

    expect( downloadItem.exists() ).toEqual( true );
    expect( downloadItem.find( '.item-content__title' ).text() ).toEqual( expectedHeader );
    expect( downloadItem.find( '.item-hover' ).text() ).toEqual( expectedHover );
    expect( downloadItem.prop( 'srcUrl' ) ).toEqual( expectedUrl );
  } );
} );
