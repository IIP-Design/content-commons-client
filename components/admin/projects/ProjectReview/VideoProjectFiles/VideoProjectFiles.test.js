import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import { Loader } from 'semantic-ui-react';
import { VIDEO_PROJECT_PREVIEW_QUERY } from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
import VideoProjectFiles from './VideoProjectFiles';

jest.mock( 'next-server/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET: 's3-bucket-url' } } ) );

jest.mock( 'lib/utils', () => ( {
  getPluralStringOrNot: jest.fn( ( array, string ) => (
    `${string}${array && array.length > 1 ? 's' : ''}`
  ) )
} ) );

jest.mock( './VideoProjectFile/VideoProjectFile', () => () => '<VideoProjectFile />' );

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
          descPublic: 'the project public description',
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
              descPublic: 'the arabic description',
              language: {
                __typename: 'Language',
                id: 'ar22',
                displayName: 'Arabic',
                languageCode: 'ar',
                locale: 'ar',
                nativeName: 'العربية',
                textDirection: 'RTL'
              },
              tags: [
                {
                  __typename: 'Tag',
                  id: 'tag13',
                  translations: [
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr555',
                      name: 'الثقافة الأميركية',
                      language: {
                        __typename: 'Language',
                        id: 'ar22',
                        displayName: 'Arabic',
                        languageCode: 'ar',
                        locale: 'ar',
                        nativeName: 'العربية',
                        textDirection: 'RTL'
                      }
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
                      id: 'ar22',
                      displayName: 'Arabic',
                      languageCode: 'ar',
                      locale: 'ar',
                      nativeName: 'العربية',
                      textDirection: 'RTL'
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
                    id: 'ar22',
                    displayName: 'Arabic',
                    languageCode: 'ar',
                    locale: 'ar',
                    nativeName: 'العربية',
                    textDirection: 'RTL'
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
            },
            {
              __typename: 'VideoUnit',
              id: 'un95',
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

const nullMocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: { project: null }
    }
  }
];

const noUnitsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: []
        }
      }
    }
  }
];

const nullUnitsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: null
        }
      }
    }
  }
];

const nullFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: null
            }
          ]
        }
      }
    }
  }
];

const emptyFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: []
            }
          ]
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <VideoProjectFiles { ...props } />
  </MockedProvider>
);

describe( '<VideoProjectFiles />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading project file(s)..."
      />
    );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.contains( loader ) ).toEqual( true );
  } );

  it( 'renders error message if an error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const errorComponent = videoProjectFiles.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders `null` if project is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'renders the final state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( toJSON( videoProjectFiles ) ).toMatchSnapshot();
  } );

  it( 'clicking the Edit button redirects to <VideoEdit />', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const header = videoProjectFiles.find( '.project_file_header' );
    const editBtns = header.find( 'Button.project_button--edit' );
    Router.push = jest.fn();

    editBtns.forEach( btn => {
      const { id } = props;
      btn.simulate( 'click' );
      expect( Router.push ).toHaveBeenCalledWith( {
        pathname: '/admin/project',
        query: {
          id,
          content: 'video',
          action: 'edit'
        }
      }, `/admin/project/video/${id}/edit` );
    } );
  } );

  it( 'renders `null` if units is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullUnitsMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'renders `null` if units is `[]`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noUnitsMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'does not render VideoProjectFile if unit.files is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullFilesMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const videoProjectFile = videoProjectFiles.find( 'VideoProjectFile' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFile.exists() ).toEqual( false );
  } );

  it( 'does not render VideoProjectFile if unit.files is `[]`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ emptyFilesMocks }>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const videoProjectFile = videoProjectFiles.find( 'VideoProjectFile' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFile.exists() ).toEqual( false );
  } );
} );
