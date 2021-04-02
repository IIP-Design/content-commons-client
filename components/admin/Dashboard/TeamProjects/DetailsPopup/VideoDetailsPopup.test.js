import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/client/testing';
import ApolloError from 'components/errors/ApolloError';
import { formatBytes, getCount, suppressActWarning } from 'lib/utils';
import VideoDetailsPopup, {
  getValidFiles, getVideoFiles, VIDEO_PROJECT_FILES_QUERY,
} from './VideoDetailsPopup';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' },
} ) );

const props = { id: '123' };

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_FILES_QUERY,
      variables: { ...props },
    },
    result: {
      data: {
        videoProject: {
          id: props.id,
          projectType: 'LANGUAGE',
          units: [
            {
              id: 'u1914',
              files: [
                {
                  id: 'f281',
                  filesize: 6424220,
                  quality: 'BROADCAST',
                  url: `2019/06/${props.id}/video-1.mp4`,
                  language: {
                    id: 'en33',
                    displayName: 'English',
                  },
                  use: {
                    id: 'u382',
                    name: 'Full Video',
                  },
                },
                {
                  id: 'f294',
                  filesize: 6424220,
                  quality: 'BROADCAST',
                  url: `2019/06/${props.id}/video-2.mp4`,
                  language: {
                    id: 'fr533',
                    displayName: 'French',
                  },
                  use: {
                    id: 'u382',
                    name: 'Full Video',
                  },
                },
              ],
            },
          ],
          supportFiles: [
            {
              id: 'v832',
              url: `2019/06/${props.id}/srt-1.srt`,
              filesize: 6424,
              language: {
                id: 'en33',
                displayName: 'English',
              },
            },
            {
              id: 'v238',
              url: `2019/06/${props.id}/srt-2.srt`,
              filesize: 6424,
              language: {
                id: 'fr533',
                displayName: 'French',
              },
            },
          ],
        },
      },
    },
  },
];

const noFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        videoProject: {
          ...mocks[0].result.data.videoProject,
          units: [
            {
              ...mocks[0].result.data.videoProject.units[0],
              files: [],
            },
          ],
          supportFiles: [],
        },
      },
    },
  },
];

const noUnitsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        videoProject: {
          ...mocks[0].result.data.videoProject,
          units: [],
        },
      },
    },
  },
];

const nullFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        videoProject: {
          ...mocks[0].result.data.videoProject,
          units: [
            {
              ...mocks[0].result.data.videoProject.units[0],
              files: null,
            },
          ],
          supportFiles: null,
        },
      },
    },
  },
];

const nullFileMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        videoProject: {
          ...mocks[0].result.data.videoProject,
          units: [
            {
              ...mocks[0].result.data.videoProject.units[0],
              files: [
                ...mocks[0].result.data.videoProject.units[0].files,
                null,
              ],
            },
          ],
          supportFiles: [
            ...mocks[0].result.data.videoProject.supportFiles,
            null,
          ],
        },
      },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VideoDetailsPopup { ...props } />
  </MockedProvider>
);

describe( '<VideoDetailsPopup />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const popup = wrapper.find( 'VideoDetailsPopup' );
    const loading = <p>Loading....</p>;

    expect( popup.exists() ).toEqual( true );
    expect( popup.contains( loading ) ).toEqual( true );
  } );

  it( 'renders error message if an error is returned', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_FILES_QUERY,
          variables: { ...props },
        },
        result: {
          errors: [{ message: 'There was an error.' }],
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <VideoDetailsPopup { ...props } />
      </MockedProvider>,
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const popup = wrapper.find( VideoDetailsPopup );
    const errorComponent = popup.find( ApolloError );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders the final state', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const popup = wrapper.find( VideoDetailsPopup );

    expect( toJSON( popup ) ).toMatchSnapshot();
  } );

  it( 'renders null if videoProject is null', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_PROJECT_FILES_QUERY,
          variables: { ...props },
        },
        result: {
          data: { videoProject: null },
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <VideoDetailsPopup { ...props } />
      </MockedProvider>,
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const popup = wrapper.find( VideoDetailsPopup );

    expect( popup.html() ).toEqual( null );
  } );

  it( 'renders a no files message if there are no files', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks } addTypename={ false }>
        <VideoDetailsPopup { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const popup = wrapper.find( VideoDetailsPopup );
    const noFilesMsg = <p>There are no supporting video files.</p>;

    expect( popup.contains( noFilesMsg ) ).toEqual( true );
  } );

  it( 'renders a no files message if files are null', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullFilesMocks } addTypename={ false }>
        <VideoDetailsPopup { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const popup = wrapper.find( VideoDetailsPopup );
    const noFilesMsg = <p>There are no supporting video files.</p>;

    expect( popup.contains( noFilesMsg ) ).toEqual( true );
  } );

  it( 'does not render video files if there are no units', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noUnitsMocks } addTypename={ false }>
        <VideoDetailsPopup { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const popup = wrapper.find( VideoDetailsPopup );
    const files = popup.find( 'li' );
    const { videoProject: { supportFiles } } = noUnitsMocks[0].result.data;
    const supportFilesCount = getValidFiles( supportFiles ).length;

    expect( files.length ).toEqual( supportFilesCount );
    files.forEach( ( file, i ) => {
      const { language: { displayName }, filesize } = supportFiles[i];

      expect( file.text() )
        .toEqual( `SRT | ${displayName} | ${formatBytes( filesize )}` );
    } );
  } );

  it( 'renders the correct number of files', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const popup = wrapper.find( VideoDetailsPopup );
    const files = popup.find( 'li' );
    const { videoProject: { units, supportFiles } } = mocks[0].result.data;
    const supportFilesCount = getValidFiles( supportFiles ).length;
    const unitFiles = getVideoFiles( units );
    const unitFilesCount = getCount( unitFiles );
    const totalFiles = supportFilesCount + unitFilesCount;

    expect( files.length ).toEqual( totalFiles );
  } );

  it( 'does not crash and renders the correct number of files if any single file is null', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullFileMocks } addTypename={ false }>
        <VideoDetailsPopup { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const popup = wrapper.find( VideoDetailsPopup );
    const files = popup.find( 'li' );
    const { videoProject: { units, supportFiles } } = nullFileMocks[0].result.data;
    const supportFilesCount = getValidFiles( supportFiles ).length;
    const unitFiles = getVideoFiles( units );
    const unitFilesCount = getCount( unitFiles );
    const totalFiles = supportFilesCount + unitFilesCount;

    expect( files.length ).toEqual( totalFiles );
  } );
} );
