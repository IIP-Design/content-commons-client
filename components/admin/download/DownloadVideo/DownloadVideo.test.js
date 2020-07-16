import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import DownloadVideo from './DownloadVideo';

jest.mock( 'lib/utils', () => ( {
  formatBytes: jest.fn( ( bytes, decimals ) => {
    if ( bytes === 0 ) return;
    const k = 1024;
    const dm = decimals || 2;
    const sizes = [
      'Bytes',
      'KB',
      'MB',
      'GB',
      'TB',
    ];
    const i = Math.floor( Math.log( bytes ) / Math.log( k ) );

    return `${parseFloat( ( bytes / k ** i ).toFixed( dm ) )} ${sizes[i]}`;
  } ),
  getS3Url: jest.fn( assetPath => `https://s3-url.com/${assetPath}` ),
} ) );

jest.mock( 'static/icons/icon_download.svg', () => 'downloadIconSVG' );
jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );

const projectId = '123';

const props = {
  instructions: 'Download the video file in English',
  selectedLanguageUnit: {
    __typename: 'VideoUnit',
    id: 'un91',
    title: 'test project title',
    descPublic: 'the english description',
    language: {
      __typename: 'Language',
      id: 'en38',
      displayName: 'English',
      languageCode: 'en',
      locale: 'en-us',
      nativeName: 'English',
      textDirection: 'LTR',
    },
    tags: [
      {
        __typename: 'Tag',
        id: 'tag13',
        translations: [
          {
            __typename: 'LanguageTranslation',
            id: 'tr999',
            name: 'american culture',
          },
        ],
      },
    ],
    thumbnails: [
      {
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
          alt: 'the alt text',
          url: `2019/06/${projectId}/image-1.jpg`,
          language: {
            __typename: 'Language',
            id: 'en38',
            displayName: 'English',
            languageCode: 'en',
            locale: 'en-us',
            nativeName: 'English',
            textDirection: 'LTR',
          },
        },
      },
    ],
    files: [
      {
        __typename: 'VideoFile',
        id: 'f19',
        createdAt: '2019-03-05T20:18:54.032Z',
        updatedAt: '2019-06-19T17:38:37.502Z',
        duration: 556,
        filename: 'video-file-1.mp4',
        filesize: 662595174,
        filetype: 'video/mp4',
        quality: 'WEB',
        url: `2019/06/${projectId}/video-file-1.mp4`,
        videoBurnedInStatus: 'CLEAN',
        dimensions: {
          __typename: 'Dimensions',
          id: 'd21',
          height: '1080',
          width: '1920',
        },
        language: {
          __typename: 'Language',
          id: 'en38',
          displayName: 'English',
          languageCode: 'en',
          locale: 'en-us',
          nativeName: 'English',
          textDirection: 'LTR',
        },
        use: {
          __typename: 'VideoUse',
          id: 'us31',
          name: 'Full Video',
        },
        stream: [
          {
            __typename: 'VideoStream',
            id: 'st93',
            site: 'YouTube',
            url: 'https://www.youtube.com/watch?v=1evw4fRu3bo',
          },
          {
            __typename: 'VideoStream',
            id: 'st35',
            site: 'Vimeo',
            url: 'https://vimeo.com/340239507',
          },
        ],
      },
      {
        __typename: 'VideoFile',
        id: 'f20',
        createdAt: '2019-03-05T20:18:54.032Z',
        updatedAt: '2019-06-19T17:38:37.502Z',
        duration: 556,
        filename: 'video-file-2.mp4',
        filesize: 652595174,
        filetype: 'video/mp4',
        quality: 'WEB',
        url: `2019/06/${projectId}/video-file-2.mp4`,
        videoBurnedInStatus: 'CLEAN',
        dimensions: {
          __typename: 'Dimensions',
          id: 'd21',
          height: '1080',
          width: '1920',
        },
        language: {
          __typename: 'Language',
          id: 'en38',
          displayName: 'English',
          languageCode: 'en',
          locale: 'en-us',
          nativeName: 'English',
          textDirection: 'LTR',
        },
        use: {
          __typename: 'VideoUse',
          id: 'us31',
          name: 'Full Video',
        },
        stream: [
          {
            __typename: 'VideoStream',
            id: 'st94',
            site: 'YouTube',
            url: 'https://www.youtube.com/watch?v=1evw4fRu3bo',
          },
          {
            __typename: 'VideoStream',
            id: 'st36',
            site: 'Vimeo',
            url: 'https://vimeo.com/340239507',
          },
        ],
      },
    ],
  },
  burnedInCaptions: false,
  isPreview: false,
};

const Component = <DownloadVideo { ...props } />;

describe( '<DownloadVideo />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders <a> tags with the correct href & download values if !isPreview', () => {
    const wrapper = mount( Component );
    const { files } = props.selectedLanguageUnit;
    const s3Bucket = 'https://s3-url.com';

    const downloadItems = wrapper.find( 'DownloadItemContent' );

    expect( downloadItems.length ).toEqual( files.length );

    downloadItems.forEach( ( item, i ) => {
      const assetPath = files[i].url;

      expect( item.prop( 'srcUrl' ) ).toEqual( `${s3Bucket}/${assetPath}` );

      const anchorLink = item.find( 'a' );

      expect( anchorLink.prop( 'href' ) ).toEqual( 'https://example.jpg' );
      expect( anchorLink.prop( 'download' ) ).toEqual( true );
    } );
  } );

  it( 'renders preview text if isPreview is true', () => {
    const wrapper = mount( Component );

    wrapper.setProps( { isPreview: true } );
    const previews = wrapper.find( '.preview-text' );
    const { files } = props.selectedLanguageUnit;

    expect( previews.length ).toEqual( files.length );
    previews.forEach( preview => {
      expect( preview.exists() )
        .toEqual( wrapper.prop( 'isPreview' ) );
      expect( preview.name() ).toEqual( 'span' );
      expect( preview.text() )
        .toEqual( 'The link will be active after publishing.' );
    } );
  } );

  it( 'does not render preview text if !isPreview', () => {
    const wrapper = mount( Component );
    const previews = wrapper.find( '.preview-text' );

    expect( previews.exists() )
      .toEqual( wrapper.prop( 'isPreview' ) );
    expect( previews.length ).toEqual( 0 );
  } );

  it( 'renders a "no video available message" if there are no video files', () => {
    const noFilesProps = {
      ...props,
      selectedLanguageUnit: {
        ...props.selectedLanguageUnit,
        files: [],
      },
    };
    const wrapper = mount( <DownloadVideo { ...noFilesProps } /> );
    const items = wrapper.find( 'a.item' );
    const { files } = noFilesProps.selectedLanguageUnit;
    const msg = 'There are no videos available for download at this time';

    expect( wrapper.exists() ).toEqual( true );
    expect( items.length ).toEqual( files.length );
    expect( wrapper.contains( msg ) ).toEqual( true );
  } );
} );
