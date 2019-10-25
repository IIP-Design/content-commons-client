import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import VideoProjectFile from './VideoProjectFile';

jest.mock( 'lib/utils', () => ( {
  formatBytes: jest.fn( () => '631.9 MB' ),
  formatDate: jest.fn( () => 'May 5, 2019' ),
  getStreamData: jest.fn( ( stream, site = 'youtube', field = 'url' ) => {
    const uri = stream.find( s => s.site.toLowerCase() === site );
    if ( uri && Object.keys( uri ).length > 0 ) {
      return uri[field];
    }
    return null;
  } ),
  getVimeoId: jest.fn( () => '340239507' ),
  getYouTubeId: jest.fn( () => '1evw4fRu3bo' ),
  secondsToHMS: jest.fn( () => '9:16' ),
  contentRegExp: jest.fn( () => false )
} ) );

const id = '123';
const props = {
  file: {
    __typename: 'VideoFile',
    id: 'f19',
    createdAt: '2019-03-05T20:18:54.032Z',
    updatedAt: '2019-06-19T17:38:37.502Z',
    duration: 556,
    filename: 'video-file-1.mp4',
    filesize: 662595174,
    filetype: 'video/mp4',
    quality: 'WEB',
    url: `2019/06/${id}/video-file-1.mp4`,
    videoBurnedInStatus: 'CLEAN',
    dimensions: {
      __typename: 'Dimensions',
      id: 'd21',
      height: '1080',
      width: '1920'
    },
    language: {
      __typename: 'Language',
      id: 'en38',
      displayName: 'English',
      languageCode: 'en',
      locale: 'en-us',
      nativeName: 'English',
      textDirection: 'LTR'
    },
    use: {
      __typename: 'VideoUse',
      id: 'us31',
      name: 'Full Video'
    },
    stream: [
      {
        __typename: 'VideoStream',
        id: 'st93',
        site: 'YouTube',
        url: 'https://www.youtube.com/watch?v=1evw4fRu3bo'
      },
      {
        __typename: 'VideoStream',
        id: 'st35',
        site: 'Vimeo',
        url: 'https://vimeo.com/340239507'
      }
    ]
  },
  thumbnail: {
    __typename: 'Thumbnail',
    id: 'th11',
    size: 'FULL',
    image: {
      __typename: 'ImageFile',
      id: 'im28',
      createdAt: '2019-03-06T13:11:48.043Z',
      updatedAt: '2019-06-18T14:58:10.024Z',
      filename: 'image-1.jpg',
      filesize: 28371,
      filetype: 'image/jpeg',
      alt: null,
      url: `https://s3-bucket-url.s3.amazonaws.com/2019/06/${id}/image-1.jpg?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE`,
      language: {
        __typename: 'Language',
        id: 'en38',
        displayName: 'English',
        languageCode: 'en',
        locale: 'en-us',
        nativeName: 'English',
        textDirection: 'LTR'
      }
    }
  }
};

const Component = <VideoProjectFile { ...props } />;

describe( '<VideoProjectFile />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders null if file prop is {}', () => {
    const wrapper = mount( Component );

    wrapper.setProps( { file: {} } );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders null if file prop is null', () => {
    const wrapper = mount( Component );

    wrapper.setProps( { file: null } );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders an embedded YouTube video', () => {
    const wrapper = mount( Component );
    const embed = wrapper.find( 'Embed' );
    const thumbnail = wrapper.find( 'figure.thumbnail' );
    const { url } = props.thumbnail.image;
    const youTubeEl = (
      <p><b className="label">YouTube URL:</b> https://www.youtube.com/watch?v=1evw4fRu3bo</p>
    );
    const vimeoEl = (
      <p><b className="label">Vimeo URL:</b> https://vimeo.com/340239507</p>
    );

    expect( embed.exists() ).toEqual( true );
    expect( embed.length ).toEqual( 1 );
    expect( embed.prop( 'id' ) ).toEqual( '1evw4fRu3bo' );
    expect( embed.prop( 'source' ) ).toEqual( 'youtube' );
    expect( embed.prop( 'placeholder' ) ).toEqual( url );
    expect( wrapper.contains( youTubeEl ) ).toEqual( true );
    expect( wrapper.contains( vimeoEl ) ).toEqual( false );
    expect( wrapper.contains( thumbnail ) ).toEqual( false );
  } );

  it( 'renders an embedded Vimeo video if there is no YouTube url', async () => {
    const vimeoProps = {
      ...props,
      file: {
        ...props.file,
        stream: [
          {
            __typename: 'VideoStream',
            id: 'st35',
            site: 'Vimeo',
            url: 'https://vimeo.com/340239507'
          }
        ]
      }
    };
    const wrapper = mount( <VideoProjectFile { ...vimeoProps } /> );
    const embed = wrapper.find( 'Embed' );
    const { url } = vimeoProps.thumbnail.image;
    const thumbnail = wrapper.find( 'figure.thumbnail' );
    const youTubeEl = (
      <p><b className="label">YouTube URL:</b> https://www.youtube.com/watch?v=1evw4fRu3bo</p>
    );
    const vimeoEl = (
      <p><b className="label">Vimeo URL:</b> https://vimeo.com/340239507</p>
    );

    expect( embed.exists() ).toEqual( true );
    expect( embed.length ).toEqual( 1 );
    expect( embed.prop( 'id' ) ).toEqual( '340239507' );
    expect( embed.prop( 'source' ) ).toEqual( 'vimeo' );
    expect( embed.prop( 'placeholder' ) ).toEqual( url );
    expect( wrapper.contains( youTubeEl ) ).toEqual( false );
    expect( wrapper.contains( vimeoEl ) ).toEqual( true );
    expect( wrapper.contains( thumbnail ) ).toEqual( false );
  } );

  it( 'renders a unit thumbnail if there are no YouTube or Vimeo urls', () => {
    const noStreamsProps = {
      ...props,
      file: {
        ...props.file,
        stream: []
      }
    };
    const wrapper = mount( <VideoProjectFile { ...noStreamsProps } /> );
    const embed = wrapper.find( 'Embed' );
    const thumbnail = wrapper.find( 'figure.thumbnail' );
    const img = thumbnail.find( 'img.thumbnail-image' );
    const { url } = noStreamsProps.thumbnail.image;
    const alt = `a thumbnail image for this file in ${noStreamsProps.file.language.displayName}`;
    const youTubeEl = (
      <p><b className="label">YouTube URL:</b> https://www.youtube.com/watch?v=1evw4fRu3bo</p>
    );
    const vimeoEl = (
      <p><b className="label">Vimeo URL:</b> https://vimeo.com/340239507</p>
    );

    expect( embed.exists() ).toEqual( false );
    expect( thumbnail.exists() ).toEqual( true );
    expect( thumbnail.length ).toEqual( 1 );
    expect( img.prop( 'src' ) ).toEqual( url );
    expect( img.prop( 'alt' ) ).toEqual( alt );
    expect( wrapper.contains( youTubeEl ) ).toEqual( false );
    expect( wrapper.contains( vimeoEl ) ).toEqual( false );
  } );

  it( 'does not render an embedded video or thumbnail if there are no streams or thumbnail', () => {
    const noStreamsProps = {
      ...props,
      file: {
        ...props.file,
        stream: []
      },
      thumbnail: {
        ...props.thumbnail,
        image: {
          ...props.thumbnail.image,
          url: ''
        }
      }
    };
    const wrapper = mount( <VideoProjectFile { ...noStreamsProps } /> );
    wrapper.setProps( { thumbnail: {} } );
    const embed = wrapper.find( 'Embed' );
    const thumbnail = wrapper.find( 'figure.thumbnail' );
    const img = thumbnail.find( 'img.thumbnail-image' );
    const youTubeEl = (
      <p><b className="label">YouTube URL:</b> https://www.youtube.com/watch?v=1evw4fRu3bo</p>
    );
    const vimeoEl = (
      <p><b className="label">Vimeo URL:</b> https://vimeo.com/340239507</p>
    );

    expect( embed.exists() ).toEqual( false );
    expect( thumbnail.exists() ).toEqual( false );
    expect( img.exists() ).toEqual( false );
    expect( wrapper.contains( youTubeEl ) ).toEqual( false );
    expect( wrapper.contains( vimeoEl ) ).toEqual( false );
  } );
} );
