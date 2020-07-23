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
    const expectedUrl = 'https://amgov-publisher-dev.s3.amazonaws.com/v1/task/download/eyJrZXkiOiIiLCJmaWxlbmFtZSI6ImM5YTQ1MzMxNTdhOTc5N2ExZWNlZTZjYTJkOGMzODJjLnNydCIsInVybCI6Imh0dHBzOi8vYW1nb3YtcHVibGlzaGVyLWRldi5zMy5hbWF6b25hd3MuY29tLzIwMjAvMDc4OGx3ZnZhZXA3L2M5YTQ1MzMxNTdhOTc5N2ExZWNlZTZjYTJkOGMzODJjLnNydCJ9';

    const wrapper = mount( <DownloadCaption item={ mockItem } /> );

    const downloadItem = wrapper.find( 'DownloadItemContent' );

    expect( downloadItem.exists() ).toEqual( true );
    expect( downloadItem.find( '.item-content__title' ).text() ).toEqual( expectedHeader );
    expect( downloadItem.find( '.item-hover' ).text() ).toEqual( expectedHover );
    expect( downloadItem.prop( 'srcUrl' ) ).toEqual( expectedUrl );
  } );
} );
