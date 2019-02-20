import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Icon, Loader } from 'semantic-ui-react';
import VideoItem from './VideoItem';

const props = {
  displayItemInModal: true,
  onClick: jest.fn(),
  itemId: '3728'
};

const Component = <VideoItem { ...props } />;

describe( '<VideoItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders `Progress` component if `isUploading`', () => {
    const wrapper = shallow( Component );
    const progress = () => wrapper.find( 'Progress' );
    const isUploading = () => wrapper.state( 'isUploading' );

    expect( isUploading() ).toEqual( false );
    expect( progress().exists() ).toEqual( isUploading() );

    wrapper.setState( { isUploading: true } );
    expect( progress().exists() ).toEqual( isUploading() );
    expect( progress().prop( 'total' ) )
      .toEqual( wrapper.state( 'video' ).source[0].size.filesize );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders a `span` component with correct props if `isUploading`', () => {
    const wrapper = shallow( Component );
    wrapper.setState( { isUploading: true } );
    const span = wrapper.childAt( 0 );

    expect( span.exists() ).toEqual( true );
    expect( span.hasClass( 'modal-trigger' ) ).toEqual( true );
    expect( span.prop( 'onClick' ) ).toEqual( null );
    expect( span.prop( 'style' ) )
      .toEqual( { cursor: 'not-allowed' } );
  } );

  it( 'renders a `button` with correct props if `displayItemInModal`', () => {
    const wrapper = shallow( Component );
    const button = wrapper.childAt( 0 );

    expect( button.exists() ).toEqual( true );
    expect( button.prop( 'onClick' )._isMockFunction )
      .toEqual( true );
    expect( button.hasClass( 'modal-trigger' ) ).toEqual( true );
    expect( button.prop( 'style' ) )
      .toEqual( { cursor: 'pointer' } );
  } );

  it( 'clicking the `button` calls `onClick`', () => {
    const wrapper = shallow( Component );
    const button = wrapper.childAt( 0 );

    button.simulate( 'click' );
    expect( button.exists() ).toEqual( true );
    expect( button.prop( 'onClick' ) ).toHaveBeenCalled();
  } );

  it( 'renders a `span` with correct props if `displayItemInModal` is `false`', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { displayItemInModal: false } );
    const span = wrapper.childAt( 0 );

    expect( span.exists() ).toEqual( true );
    expect( span.hasClass( 'wrapper' ) ).toEqual( true );
    expect( span.prop( 'onClick' ) ).toEqual( null );
    expect( span.prop( 'style' ) )
      .toEqual( { cursor: 'default' } );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders null if `video` state is empty', () => {
    const wrapper = shallow( Component );

    wrapper.setState( { video: {} } );
    expect( wrapper.state( 'video' ) ).toEqual( {} );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders null if there is no `video` state', () => {
    const wrapper = shallow( Component );

    wrapper.setState( { video: null } );
    expect( wrapper.state( 'video' ) ).toEqual( null );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders an uploading message and `Loader` if `video` is loading', () => {
    const wrapper = shallow( Component );

    wrapper.setState( {
      video: {
        id: '3728',
        title: 'Made in America',
        uploadStatus: {
          error: false,
          success: false
        },
        loading: true
      }
    } );

    expect( wrapper.state( 'video' ).loading )
      .toEqual( true );
    expect( wrapper.contains(
      <Loader active inline="centered">
        <p style={ { fontSize: '0.75em' } }>
          Preparing file for upload...
        </p>
      </Loader>
    ) ).toEqual( true );
  } );

  it( 'renders error icon and message if `video` has an error `uploadStatus`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'li.video.error' ).exists() )
      .toEqual( false );

    wrapper.setState( {
      video: {
        id: '3728',
        title: 'Made in America',
        uploadStatus: {
          error: true,
          success: false
        },
        source: [
          {
            burnedInCaptions: 'false',
            downloadUrl: 'https://video-download-url.com',
            duration: '9:16',
            filetype: '',
            md5: '',
            fileName: 'madeinamerica_english.mp4',
            size: {
              bitrate: 9832917,
              filesize: 662595174,
              height: '1080',
              width: '1920'
            },
          }
        ]
      }
    } );

    expect( wrapper.state( 'video' ).uploadStatus.error )
      .toEqual( true );
    expect( wrapper.find( 'li.video.error' ).exists() )
      .toEqual( true );
    expect( wrapper.contains(
      <Icon
        color="red"
        name="exclamation triangle"
        size="large"
      />
    ) ).toEqual( true );
    expect( wrapper.find( 'p' ).text() )
      .toEqual( 'An uploading error occurred for this item.' );
  } );

  it( 'renders error icon and message if `video` has an error', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'li.video.error' ).exists() )
      .toEqual( false );

    wrapper.setState( {
      video: {
        id: '3728',
        title: 'Made in America',
        uploadStatus: {
          error: false,
          success: false
        },
        error: true,
        source: [
          {
            burnedInCaptions: 'false',
            downloadUrl: 'https://video-download-url.com',
            duration: '9:16',
            filetype: '',
            md5: '',
            fileName: 'madeinamerica_english.mp4',
            size: {
              bitrate: 9832917,
              filesize: 662595174,
              height: '1080',
              width: '1920'
            },
          }
        ]
      }
    } );

    expect( wrapper.state( 'video' ).error ).toEqual( true );
    expect( wrapper.find( 'li.video.error' ).exists() )
      .toEqual( true );
    expect( wrapper.contains(
      <Icon
        color="red"
        name="exclamation triangle"
        size="large"
      />
    ) ).toEqual( true );
    expect( wrapper.find( 'p' ).text() )
      .toEqual( 'A loading error occurred for this item.' );
  } );
} );
