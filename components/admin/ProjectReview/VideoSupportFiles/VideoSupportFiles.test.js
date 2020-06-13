import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { Icon, Loader } from 'semantic-ui-react';

import { getCount } from 'lib/utils';
import VideoSupportFiles, {
  VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
} from './VideoSupportFiles';

const props = { id: '123' };

const srts = [
  {
    id: '34is',
    filename: 'srt-1.srt',
    language: {
      id: 'en22',
      displayName: 'English',
    },
  },
  {
    id: '48sa',
    filename: 'srt-2.srt',
    language: {
      id: 'fr87',
      displayName: 'French',
    },
  },
];

const additionalFiles = [
  {
    id: '82kw',
    filename: 'pdf-1.pdf',
    filetype: 'application/pdf',
    language: {
      id: 'en22',
      displayName: 'English',
    },
  },
  {
    id: '28zi',
    filename: 'pdf-2.pdf',
    filetype: 'application/pdf',
    language: {
      id: 'fr87',
      displayName: 'French',
    },
  },
];

const thumbnails = [
  {
    id: 't372',
    filename: 'thumbnail-1.jpg',
    filetype: 'image/jpeg',
    language: {
      id: 'en22',
      displayName: 'English',
    },
  },
  {
    id: 't482',
    filename: 'thumbnail-2.jpg',
    filetype: 'image/jpeg',
    language: {
      id: 'fr87',
      displayName: 'French',
    },
  },
];

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
      variables: { id: props.id },
    },
    result: {
      data: {
        project: {
          id: '123',
          srts,
          additionalFiles,
          thumbnails,
        },
      },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VideoSupportFiles { ...props } />
  </MockedProvider>
);

describe( '<VideoSupportFiles />', () => {
  it.skip( 'renders initial loading state without crashing', () => {
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
          variables: { id: props.id },
        },
        result: {
          errors: [{ message: 'There was an error.' }],
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
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

  it.skip( 'renders the final state', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const items = videoSupportFiles.find( 'VideoSupportFilesItem' );
    const totalFilesCount = getCount( srts ) + getCount( additionalFiles ) + getCount( thumbnails );

    expect( items.length ).toEqual( totalFilesCount );
    expect( toJSON( videoSupportFiles ) ).toMatchSnapshot();
  } );

  it( 'renders `null` if project is `null`', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: { project: null },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );

    expect( videoSupportFiles.html() ).toEqual( null );
  } );

  it( 'renders `null` if srts, additionalFiles, and thumbnails are `null`', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts: null,
              additionalFiles: null,
              thumbnails: null,
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );

    expect( videoSupportFiles.exists() ).toEqual( true );
    expect( videoSupportFiles.html() ).toEqual( null );
  } );

  it( 'renders `null` if srts, additionalFiles, and thumbnails are `[]`', async () => {
    const emptyMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts: [],
              additionalFiles: [],
              thumbnails: [],
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptyMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
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
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts: null,
              additionalFiles,
              thumbnails,
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullSrtsMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const srtSection = videoSupportFiles.find( 'section.files.section' );

    expect( srtSection.exists() ).toEqual( false );
  } );

  it( 'does not render the srt section if srts is `[]`', async () => {
    const emptySrtsMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts: [],
              additionalFiles,
              thumbnails,
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptySrtsMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const srtSection = videoSupportFiles.find( 'section.files.section' );

    expect( srtSection.exists() ).toEqual( false );
  } );

  it( 'does not render the additional files section if additionalFiles and thumbnails are `null`', async () => {
    const nullAdditionalFilesMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts,
              additionalFiles: null,
              thumbnails: null,
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullAdditionalFilesMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const additionalFilesSection = videoSupportFiles.find( 'section.addtl_files.section' );

    expect( additionalFilesSection.exists() ).toEqual( false );
  } );

  it( 'does not render the additional files section if additionalFiles and thumbnails are `[]`', async () => {
    const emptyAdditionalFilesMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts,
              additionalFiles: [],
              thumbnails: [],
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptyAdditionalFilesMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const additionalFilesSection = videoSupportFiles.find( 'section.addtl_files.section' );

    expect( additionalFilesSection.exists() ).toEqual( false );
  } );

  it( 'renders the additional files section with thumbnails only if additionalFiles is `null`', async () => {
    const nullAdditionalFilesMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts,
              additionalFiles: null,
              thumbnails,
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullAdditionalFilesMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const additionalFilesSection = videoSupportFiles.find( 'section.addtl_files.section' );
    const items = additionalFilesSection.find( 'VideoSupportFilesItem' );

    expect( items.length ).toEqual( getCount( thumbnails ) );
    items.forEach( ( item, i ) => {
      expect( item.contains( thumbnails[i].filename ) ).toEqual( true );
      expect( item.contains( additionalFiles[i].filename ) ).toEqual( false );
    } );
  } );

  it( 'renders the additional files section with thumbnails only if additionalFiles is `[]`', async () => {
    const emptyAdditionalFilesMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts,
              additionalFiles: [],
              thumbnails,
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptyAdditionalFilesMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const additionalFilesSection = videoSupportFiles.find( 'section.addtl_files.section' );
    const items = additionalFilesSection.find( 'VideoSupportFilesItem' );

    expect( items.length ).toEqual( getCount( thumbnails ) );
    items.forEach( ( item, i ) => {
      expect( item.contains( thumbnails[i].filename ) ).toEqual( true );
      expect( item.contains( additionalFiles[i].filename ) ).toEqual( false );
    } );
  } );

  it( 'renders the additional files section with additionalFiles only if thumbnails is `null`', async () => {
    const nullThumbnailsMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts,
              additionalFiles,
              thumbnails: null,
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullThumbnailsMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const additionalFilesSection = videoSupportFiles.find( 'section.addtl_files.section' );
    const items = additionalFilesSection.find( 'VideoSupportFilesItem' );

    expect( items.length ).toEqual( getCount( additionalFiles ) );
    items.forEach( ( item, i ) => {
      expect( item.contains( thumbnails[i].filename ) ).toEqual( false );
      expect( item.contains( additionalFiles[i].filename ) ).toEqual( true );
    } );
  } );

  it( 'renders the additional files section with additionalFiles only if thumbnails is `[]`', async () => {
    const emptyThumbnailsMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
          variables: { id: props.id },
        },
        result: {
          data: {
            project: {
              id: '123',
              srts,
              additionalFiles,
              thumbnails: [],
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptyThumbnailsMocks } addTypename={ false }>
        <VideoSupportFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoSupportFiles = wrapper.find( 'VideoSupportFiles' );
    const additionalFilesSection = videoSupportFiles.find( 'section.addtl_files.section' );
    const items = additionalFilesSection.find( 'VideoSupportFilesItem' );

    expect( items.length ).toEqual( getCount( additionalFiles ) );
    items.forEach( ( item, i ) => {
      expect( item.contains( thumbnails[i].filename ) ).toEqual( false );
      expect( item.contains( additionalFiles[i].filename ) ).toEqual( true );
    } );
  } );
} );
