import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Loader } from 'semantic-ui-react';
import PreviewProjectContent, { VIDEO_PROJECT_PREVIEW_QUERY } from './PreviewProjectContent';

jest.mock( 'lib/utils', () => ( {
  getPathToS3Bucket: jest.fn( () => {} ),
  getS3Url: jest.fn( assetPath => (
    `https://s3-url.com/${assetPath}`
  ) ),
  getStreamData: jest.fn( ( stream, site = 'youtube', field = 'url' ) => {
    const uri = stream.find( s => s.site.toLowerCase() === site );
    if ( uri && Object.keys( uri ).length > 0 ) {
      return uri[field];
    }
    return null;
  } ),
  getVimeoId: jest.fn( () => '340239507' ),
  getYouTubeId: jest.fn( () => '1evw4fRu3bo' ),
  contentRegExp: jest.fn( () => false )
} ) );

const props = { id: '123' };

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          __typename: 'VideoProject',
          id: props.id,
          projectType: 'LANGUAGE',
          team: {
            __typename: 'Team',
            id: 't81',
            name: 'the team name'
          },
          thumbnails: [
            {
              __typename: 'ImageFile',
              id: 'th11',
              createdAt: '2019-03-06T13:11:48.043Z',
              updatedAt: '2019-06-18T14:58:10.024Z',
              filename: 'image-1.jpg',
              filesize: 28371,
              filetype: 'image/jpeg',
              alt: 'the alt text',
              url: `2019/06/${props.id}/image-1.jpg`,
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
          ],
          units: [
            {
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
                textDirection: 'LTR'
              },
              tags: [
                {
                  __typename: 'Tag',
                  id: 'tag13',
                  translations: [
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr999',
                      name: 'american culture'
                    }
                  ]
                }
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
                    url: `2019/06/${props.id}/image-1.jpg`,
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
                  url: `2019/06/${props.id}/video-file-1.mp4`,
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
                }
              ]
            }
          ]
        }
      }
    }
  }
];

const vimeoMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: [
                {
                  ...mocks[0].result.data.project.units[0].files[0],
                  stream: [
                    {
                      __typename: 'VideoStream',
                      id: 'st35',
                      site: 'Vimeo',
                      url: 'https://vimeo.com/340239507'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  }
];

const noStreamsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: [
                {
                  ...mocks[0].result.data.project.units[0].files[0],
                  stream: []
                }
              ]
            }
          ]
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <PreviewProjectContent { ...props } />
  </MockedProvider>
);

describe( '<PreviewProjectContent />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const preview = wrapper.find( 'PreviewProjectContent' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
      />
    );
    const msg = <p>Loading the project preview...</p>;

    expect( preview.exists() ).toEqual( true );
    expect( preview.contains( loader ) ).toEqual( true );
    expect( preview.contains( msg ) ).toEqual( true );
  } );

  it( 'renders error message if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_QUERY,
          variables: { id: '123' }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const errorComponent = preview.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.') )
      .toEqual( true );
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );

    expect( toJSON( preview ) ).toMatchSnapshot();
  } );

  it( 'sets dropDownIsOpen and selectedLanguage in initial state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const { dropDownIsOpen, selectedLanguage } = inst.state;

    expect( dropDownIsOpen ).toEqual( false );
    expect( selectedLanguage ).toEqual( 'English' );
  } );

  it( 'calling getLanguages gets the unit language(s)', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getLanguages' );
    const { units } = mocks[0].result.data.project;

    const languages = inst.getLanguages( units );

    expect( spy ).toHaveBeenCalled();
    expect( languages ).toEqual( [
      { key: 'en', value: 'English', text: 'English' }
    ] );
  } );

  it( 'calling getProjectUnits gets the projectUnits', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getProjectUnits' );
    const { units } = mocks[0].result.data.project;

    const projectUnits = inst.getProjectUnits( units );

    expect( spy ).toHaveBeenCalled();
    expect( projectUnits ).toEqual( {
      [units[0].language.displayName]: units[0]
    } );
  } );

  it( 'handleChange updates selectedLanguage and selectedItem in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const { units } = mocks[0].result.data.project;

    const handleChangeSpy = jest.spyOn( inst, 'handleChange' );
    const toggleArrowSpy = jest.spyOn( inst, 'toggleArrow' );
    const selectLanguageSpy = jest.spyOn( inst, 'selectLanguage' );

    const e = {};
    const selection = { value: 'French' };

    inst.handleChange( e, selection );

    const { selectedLanguage, selectedItem } = inst.state;

    expect( handleChangeSpy ).toHaveBeenCalledWith( e, selection );
    expect( toggleArrowSpy ).toHaveBeenCalled();
    expect( selectLanguageSpy ).toHaveBeenCalledWith( selection.value );

    expect( selectedLanguage ).toEqual( selection.value );
    expect( selectedItem ).toEqual(
      units.find( unit => unit.language.displayName === selectedLanguage )
    );
  } );

  it( 'toggleArrow updates dropDownIsOpen in state & updates dropdown icon', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = () => wrapper.find( 'PreviewProjectContent' );
    const dropdown = () => preview().find( 'Dropdown.modal_languages' );
    const inst = preview().instance();
    const spy = jest.spyOn( inst, 'toggleArrow' );

    expect( inst.state.dropDownIsOpen ).toEqual( false );
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron down' );

    inst.toggleArrow();
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( inst.state.dropDownIsOpen ).toEqual( true );
    wrapper.update();
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron up' );

    inst.toggleArrow();
    expect( spy ).toHaveBeenCalledTimes( 2 );
    expect( inst.state.dropDownIsOpen ).toEqual( false );
    wrapper.update();
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron down' );
  } );

  it( 'selectLanguage updates selectedLanguage in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const selectedLanguage = () => inst.state.selectedLanguage;
    const spy = jest.spyOn( inst, 'selectLanguage' );

    expect( selectedLanguage() ).toEqual( 'English' );

    inst.selectLanguage( 'French' );
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( selectedLanguage() ).toEqual( 'French' );

    inst.selectLanguage( 'English' );
    expect( spy ).toHaveBeenCalledTimes( 2 );
    expect( selectedLanguage() ).toEqual( 'English' );
  } );

  it( 'getContentType returns the correct content type', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getContentType' );
    const videoType = inst.getContentType( 'VideoProject' );
    const noType = inst.getContentType();

    expect( spy ).toHaveBeenCalled();
    expect( videoType ).toEqual( 'video' );
    expect( noType ).toEqual( '' );
  } );

  it( 'renders an embedded YouTube video', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const embed = preview.find( 'Embed' );
    const assetPath = mocks[0].result.data.project.thumbnails[0].url;
    const s3Bucket = 'https://s3-url.com';

    expect( embed.exists() ).toEqual( true );
    expect( embed.prop( 'id' ) ).toEqual( '1evw4fRu3bo' );
    expect( embed.prop( 'source' ) ).toEqual( 'youtube' );
    expect( embed.prop( 'placeholder' ) )
      .toEqual( `${s3Bucket}/${assetPath}` );
  } );

  it( 'renders an embedded Vimeo video if there is no YouTube url', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ vimeoMocks } addTypename>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const embed = preview.find( 'Embed' );
    const assetPath = vimeoMocks[0].result.data.project.thumbnails[0].url;
    const s3Bucket = 'https://s3-url.com';

    expect( embed.exists() ).toEqual( true );
    expect( embed.prop( 'id' ) ).toEqual( '340239507' );
    expect( embed.prop( 'source' ) ).toEqual( 'vimeo' );
    expect( embed.prop( 'placeholder' ) )
      .toEqual( `${s3Bucket}/${assetPath}` );
  } );

  it( 'renders a project thumbnail if there are no YouTube or Vimeo urls', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noStreamsMocks } addTypename>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const embed = preview.find( 'Embed' );
    const thumbnail = preview.find( 'figure.modal_thumbnail' );
    const img = thumbnail.find( 'img.overlay-image' );
    const assetPath = noStreamsMocks[0].result.data.project.thumbnails[0].url;
    const { alt } = noStreamsMocks[0].result.data.project.thumbnails[0];
    const s3Bucket = 'https://s3-url.com';

    expect( embed.exists() ).toEqual( false );
    expect( thumbnail.exists() ).toEqual( true );
    expect( img.prop( 'src' ) ).toEqual( `${s3Bucket}/${assetPath}` );
    expect( img.prop( 'alt' ) ).toEqual( alt );
  } );
} );
