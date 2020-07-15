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
jest.mock(
  '../DownloadItem',
  () => function DownloadItem() { return ''; },
);

const mockInstructions = 'Download caption file(s) for this video.';

describe( '<DownloadCaption />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <DownloadCaption instructions={ mockInstructions } item={ mockItem } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the instructions if provided', () => {
    const wrapper = mount( <DownloadCaption item={ mockItem } /> );

    const instructions = wrapper.find( '.form-group_instructions' );

    expect( instructions.exists() ).toEqual( false );

    wrapper.setProps( { instructions: mockInstructions } );

    const newInstructions = wrapper.find( '.form-group_instructions' );

    expect( newInstructions.exists() ).toEqual( true );
    expect( newInstructions.contains( mockInstructions ) ).toEqual( true );
  } );

  it( 'passes the correct data to the DownloadItem', () => {
    const expectedDownload = 'English_SRT';
    const expectedHeader = 'Download English SRT';
    const expectedHover = 'Download English SRT';
    const expectedUrl = 'https://amgov-publisher-dev.s3.amazonaws.com/v1/task/download/eyJrZXkiOiIiLCJmaWxlbmFtZSI6ImM5YTQ1MzMxNTdhOTc5N2ExZWNlZTZjYTJkOGMzODJjLnNydCIsInVybCI6Imh0dHBzOi8vYW1nb3YtcHVibGlzaGVyLWRldi5zMy5hbWF6b25hd3MuY29tLzIwMjAvMDc4OGx3ZnZhZXA3L2M5YTQ1MzMxNTdhOTc5N2ExZWNlZTZjYTJkOGMzODJjLnNydCJ9';

    const wrapper = mount( <DownloadCaption item={ mockItem } /> );

    const downloadItem = wrapper.find( 'DownloadItem' );

    expect( downloadItem.exists() ).toEqual( true );
    expect( downloadItem.prop( 'download' ) ).toEqual( expectedDownload );
    expect( downloadItem.prop( 'header' ) ).toEqual( expectedHeader );
    expect( downloadItem.prop( 'hover' ) ).toEqual( expectedHover );
    expect( downloadItem.prop( 'url' ) ).toEqual( expectedUrl );
  } );
} );
