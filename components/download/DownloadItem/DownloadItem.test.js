import { mount } from 'enzyme';
import DownloadItem from './DownloadItem';

const props = {
  instructions: 'Here are the download item instructions.',
};

const Component
  = <DownloadItem { ...props }><p>TEST</p></DownloadItem>;

describe( '<DownloadItem />', () => {
  const wrapper = mount( Component );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'displays the download instructions', () => {
    const instructionsDiv = wrapper.find( '.download-item__instructions' );

    expect( instructionsDiv.exists() ).toEqual( true );
    expect( instructionsDiv.text() ).toEqual( props.instructions );
  } );
} );
