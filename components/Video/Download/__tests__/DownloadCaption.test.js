import { mount } from 'enzyme';

import DownloadCaption from '../DownloadCaption';
import { mockItem } from '../../mocks';

jest.mock( '../DownloadItem', () => 'download-item' );

const mockIntructions = 'Download caption file(s) for this video.';

describe( '<DownloadCaption />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <DownloadCaption instructions={ mockIntructions } item={ mockItem } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the instructions if provided', () => {
    const wrapper = mount( <DownloadCaption item={ mockItem } /> );

    const instructions = wrapper.find( '.form-group_instructions' );

    expect( instructions.exists() ).toEqual( false );

    wrapper.setProps( { instructions: mockIntructions } );

    const newInstructions = wrapper.find( '.form-group_instructions' );

    expect( newInstructions.exists() ).toEqual( true );
    expect( newInstructions.contains( mockIntructions ) ).toEqual( true );
  } );

  it( 'passes the correct data to the DownloadItem', () => {
    const expectedDownload = 'English_SRT';
    const expectedHeader = 'Download English SRT';
    const expectedHover = 'Download English SRT';
    const expectedUrl = 'https://amgov-publisher-dev.s3.amazonaws.com/2020/0788lwfvaep7/c9a4533157a9797a1ecee6ca2d8c382c.srt';

    const wrapper = mount( <DownloadCaption item={ mockItem } /> );

    const downloadItem = wrapper.find( 'download-item' );

    expect( downloadItem.exists() ).toEqual( true );
    expect( downloadItem.prop( 'download' ) ).toEqual( expectedDownload );
    expect( downloadItem.prop( 'header' ) ).toEqual( expectedHeader );
    expect( downloadItem.prop( 'hover' ) ).toEqual( expectedHover );
    expect( downloadItem.prop( 'url' ) ).toEqual( expectedUrl );
  } );
} );
