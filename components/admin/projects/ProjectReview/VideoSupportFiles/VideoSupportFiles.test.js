import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import VideoSupportFiles, {
  VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
} from './VideoSupportFiles';

const props = { id: '123' };

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          id: '123',
          protectImages: null,
          srts: [
            {
              id: '34is',
              filename: 'srt-1.srt',
              language: {
                id: 'en22',
                displayName: 'English'
              }
            },
            {
              id: '48sa',
              filename: 'srt-2.srt',
              language: {
                id: 'fr87',
                displayName: 'French'
              }
            }
          ],
          additionalFiles: [
            {
              id: '82kw',
              filename: 'image-1.jpg',
              filetype: 'jpg',
              language: {
                id: 'en22',
                displayName: 'English'
              }
            },
            {
              id: '28zi',
              filename: 'image-2.jpg',
              filetype: 'jpg',
              language: {
                id: 'fr87',
                displayName: 'French'
              }
            }
          ]
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VideoSupportFiles { ...props } />
  </MockedProvider>
);

describe( '<VideoSupportFiles />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading support file(s)..."
      />
    );

    expect( videoSupportFiles.exists() ).toEqual( true );
    expect( videoSupportFiles.contains( loader ) ).toEqual( true );
    expect( toJSON( videoSupportFiles ) ).toMatchSnapshot();
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const div = videoSupportFiles
      .find( 'div.video-support-files.error' );
    const icon = <Icon color="red" name="exclamation triangle" />;
    const span = <span>Loading error...</span>;

    expect( div.exists() ).toEqual( true );
    expect( videoSupportFiles.contains( icon ) )
      .toEqual( true );
    expect( videoSupportFiles.contains( span ) )
      .toEqual( true );
  } );

  it( 'renders the final state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );

    expect( toJSON( videoSupportFiles ) ).toMatchSnapshot();
  } );

  it( 'renders `null` if project is `null`', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          data: { project: null }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );

    expect( videoSupportFiles.html() ).toEqual( null );
  } );

  it( 'renders `null` if srts and additionalFiles are `null`', async () => {
    const nullSrtsAdditionalFilesMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          data: {
            project: {
              id: '123',
              protectImages: null,
              srts: null,
              additionalFiles: null
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullSrtsAdditionalFilesMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );

    expect( videoSupportFiles.exists() ).toEqual( true );
    expect( videoSupportFiles.html() ).toEqual( null );
  } );

  it( 'renders `null` if srts and additionalFiles are `[]`', async () => {
    const nullSrtsAdditionalFilesMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          data: {
            project: {
              id: '123',
              protectImages: null,
              srts: [],
              additionalFiles: []
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullSrtsAdditionalFilesMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );

    expect( videoSupportFiles.exists() ).toEqual( true );
    expect( videoSupportFiles.html() ).toEqual( null );
  } );

  it( 'does not render the srt section if srts is `null`', async () => {
    const nullSrtsMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          data: {
            project: {
              id: '123',
              protectImages: null,
              srts: null,
              additionalFiles: [
                {
                  id: '82kw',
                  filename: 'image-1.jpg',
                  filetype: 'jpg',
                  language: {
                    id: 'en22',
                    displayName: 'English'
                  }
                },
                {
                  id: '28zi',
                  filename: 'image-2.jpg',
                  filetype: 'jpg',
                  language: {
                    id: 'fr87',
                    displayName: 'French'
                  }
                }
              ]
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullSrtsMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const srtSection = videoSupportFiles.find( 'section.files.section' );

    expect( srtSection.exists() ).toEqual( false );
  } );

  it( 'does not render the srt section if srts is `[]`', async () => {
    const nullSrtsMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          data: {
            project: {
              id: '123',
              protectImages: null,
              srts: [],
              additionalFiles: [
                {
                  id: '82kw',
                  filename: 'image-1.jpg',
                  filetype: 'jpg',
                  language: {
                    id: 'en22',
                    displayName: 'English'
                  }
                },
                {
                  id: '28zi',
                  filename: 'image-2.jpg',
                  filetype: 'jpg',
                  language: {
                    id: 'fr87',
                    displayName: 'French'
                  }
                }
              ]
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullSrtsMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const srtSection = videoSupportFiles.find( 'section.files.section' );

    expect( srtSection.exists() ).toEqual( false );
  } );

  it( 'does not render the additional files section if additionalFiles is `null`', async () => {
    const nullAdditionalFilesMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          data: {
            project: {
              id: '123',
              protectImages: null,
              srts: [
                {
                  id: '34is',
                  filename: 'srt-1.srt',
                  language: {
                    id: 'en22',
                    displayName: 'English'
                  }
                },
                {
                  id: '48sa',
                  filename: 'srt-2.srt',
                  language: {
                    id: 'fr87',
                    displayName: 'French'
                  }
                }
              ],
              additionalFiles: null
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullAdditionalFilesMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const additionalFilesSection = videoSupportFiles.find( 'section.addtl_files.section' );

    expect( additionalFilesSection.exists() ).toEqual( false );
  } );

  it( 'does not render the additional files section if additionalFiles is `[]`', async () => {
    const nullAdditionalFilesMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          data: {
            project: {
              id: '123',
              protectImages: null,
              srts: [
                {
                  id: '34is',
                  filename: 'srt-1.srt',
                  language: {
                    id: 'en22',
                    displayName: 'English'
                  }
                },
                {
                  id: '48sa',
                  filename: 'srt-2.srt',
                  language: {
                    id: 'fr87',
                    displayName: 'French'
                  }
                }
              ],
              additionalFiles: []
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullAdditionalFilesMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const additionalFilesSection = videoSupportFiles.find( 'section.addtl_files.section' );

    expect( additionalFilesSection.exists() ).toEqual( false );
  } );
} );
