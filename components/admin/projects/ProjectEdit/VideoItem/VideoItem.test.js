import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import VideoItem, { VIDEO_ITEM_QUERY } from './VideoItem';

const props = {
  displayItemInModal: true,
  onClick: jest.fn(),
  itemId: '3728'
};

const mocks = [
  {
    request: {
      query: VIDEO_ITEM_QUERY,
      variables: { id: props.itemId }
    },
    result: {
      data: {
        video: {
          id: 'xyz123',
          title: 'Test Title',
          files: [
            {
              filename: 'test-file.mp4',
              filesize: 662595174
            }
          ],
          thumbnails: {
            image: {
              alt: 'some alt text',
              url: 'https://staticcdp.s3.amazonaws.com/2018/05/courses.america.gov_1481/b3b38d194ff80d06dd837f57a41fe16f.jpg',
              dimensions: {
                height: 393,
                width: 770
              }
            }
          },
          language: {
            displayName: 'English',
            textDirection: 'LTR'
          }
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VideoItem { ...props } />
  </MockedProvider>
);

describe( '<VideoItem />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoItem = wrapper.find( 'VideoItem' );
    const loader = (
      <Loader active inline="centered">
        <p style={ { fontSize: '0.75em' } }>
          Preparing file for upload...
        </p>
      </Loader>
    );

    expect( videoItem.exists() ).toEqual( true );
    expect( videoItem.contains( loader ) ).toEqual( true );
    expect( toJSON( videoItem ) ).toMatchSnapshot();
  } );

  it( 'renders error icon and message if `video` has an error', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_ITEM_QUERY,
          variables: { id: props.itemId }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <VideoItem { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoItem = wrapper.find( 'VideoItem' );
    const li = videoItem.find( 'li.video.error' );
    const icon = <Icon color="red" name="exclamation triangle" size="large" />;

    expect( videoItem.exists() ).toEqual( true );
    expect( li.exists() ).toEqual( true );
    expect( videoItem.contains( icon ) ).toEqual( true );
    expect( videoItem.find( 'p' ).text() )
      .toEqual( 'A loading error occurred for this item.' );
  } );

  it( 'renders `Progress` component if `isUploading`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoItem = () => wrapper.find( 'VideoItem' );
    const progress = () => videoItem().find( 'Progress' );
    const isUploading = () => videoItem().state( 'isUploading' );
    const filesize = () => videoItem().prop( 'data' ).video.files[0].filesize;

    expect( isUploading() ).toEqual( false );
    expect( progress().exists() ).toEqual( isUploading() );

    videoItem().setState( { isUploading: true } );

    expect( isUploading() ).toEqual( true );
    expect( progress().exists() ).toEqual( isUploading() );
    expect( progress().prop( 'total' ) ).toEqual( filesize() );
    expect( toJSON( videoItem() ) ).toMatchSnapshot();
  } );

  it( 'renders null if `video` is null', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_ITEM_QUERY,
          variables: { id: props.itemId }
        },
        result: { data: { video: null } }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <VideoItem { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoItem = wrapper.find( 'VideoItem' );

    expect( videoItem.html() ).toEqual( null );
  } );

  it( 'renders a `span` component with correct props if `isUploading`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoItem = () => wrapper.find( 'VideoItem' );

    videoItem().setState( { isUploading: true } );

    const span = videoItem().find( 'span' );

    expect( span.exists() ).toEqual( true );
    expect( span.hasClass( 'modal-trigger' ) ).toEqual( true );
    expect( span.prop( 'onClick' ) ).toEqual( null );
    expect( span.prop( 'style' ) )
      .toEqual( { cursor: 'not-allowed' } );
  } );

  it( 'renders a `button` with correct props if `displayItemInModal`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoItem = wrapper.find( 'VideoItem' );
    const button = videoItem.find( 'button' );

    expect( videoItem.prop( 'displayItemInModal' ) ).toEqual( true );
    expect( button.exists() ).toEqual( true );
    expect( button.prop( 'onClick' )._isMockFunction )
      .toEqual( true );
    expect( button.hasClass( 'modal-trigger' ) ).toEqual( true );
    expect( button.prop( 'style' ) )
      .toEqual( { cursor: 'pointer' } );
  } );

  it( 'renders a `span` with correct props if `displayItemInModal` is `false`', async () => {
    const newProps = {
      displayItemInModal: false,
      onClick: jest.fn(),
      itemId: '3728'
    };

    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <VideoItem { ...newProps } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoItem = () => wrapper.find( 'VideoItem' );
    const span = videoItem().find( 'span' );

    expect( videoItem().prop( 'displayItemInModal' ) ).toEqual( false );
    expect( span.exists() ).toEqual( true );
    expect( span.hasClass( 'wrapper' ) ).toEqual( true );
    expect( span.prop( 'onClick' ) ).toEqual( null );
    expect( span.prop( 'style' ) )
      .toEqual( { cursor: 'default' } );
    expect( toJSON( videoItem() ) ).toMatchSnapshot();
  } );

  it( 'clicking the `button` calls `onClick`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoItem = wrapper.find( 'VideoItem' );
    const button = videoItem.find( 'button' );

    button.simulate( 'click' );
    expect( button.exists() ).toEqual( true );
    expect( button.prop( 'onClick' ) ).toHaveBeenCalled();
  } );
} );
