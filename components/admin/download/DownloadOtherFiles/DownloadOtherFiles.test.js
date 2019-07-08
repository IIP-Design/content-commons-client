import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Loader } from 'semantic-ui-react';
import DownloadOtherFiles, { VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY } from './DownloadOtherFiles';

jest.mock( 'lib/utils', () => ( {
  getPathToS3Bucket: jest.fn( () => {} ),
  getS3Url: jest.fn( assetPath => (
    `https://s3-url.com/${assetPath}`
  ) )
} ) );

jest.mock( 'static/icons/icon_download.svg', () => 'downloadIconSVG' );

const props = {
  id: '123',
  instructions: 'Download Other File(s)',
  isPreview: false
};

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          id: props.id,
          files: [
            {
              id: 'pdf89',
              filename: 'file-1.pdf',
              filetype: 'application/pdf',
              url: `2019/06/${props.id}/file-1.pdf`,
              language: {
                id: 'en23',
                displayName: 'English'
              }
            },
            {
              id: 'au56',
              filename: 'audio-1.mp3',
              filetype: 'audio/x-mpeg-3',
              url: `2019/06/${props.id}/audio-1.mp3`,
              language: {
                id: 'en23',
                displayName: 'English'
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
    <DownloadOtherFiles { ...props } />
  </MockedProvider>
);

describe( '<DownloadOtherFiles />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const downloadOther = wrapper.find( 'DownloadOtherFiles' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading other file(s)..."
      />
    );

    expect( downloadOther.exists() ).toEqual( true );
    expect( downloadOther.contains( loader ) ).toEqual( true );
    expect( toJSON( downloadOther ) ).toMatchSnapshot();
  } );

  it( 'renders error message if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <DownloadOtherFiles { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const downloadOther = wrapper.find( 'DownloadOtherFiles' );
    const errorComponent = downloadOther.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const downloadOther = wrapper.find( 'DownloadOtherFiles' );

    expect( toJSON( downloadOther ) ).toMatchSnapshot();
  } );

  it( 'renders null if project is null', async () => {
    const nullProjectMocks = [
      {
        ...mocks[0],
        result: { data: { project: null } }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullProjectMocks } addTypename={ false }>
        <DownloadOtherFiles { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadOther = wrapper.find( 'DownloadOtherFiles' );

    expect( downloadOther.html() ).toEqual( null );
  } );

  it( 'renders null if project is {}', async () => {
    // ignore console.warn about missing field `id` and `files`
    const emptyProjectMocks = [
      {
        ...mocks[0],
        result: { data: { project: {} } }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptyProjectMocks } addTypename={ false }>
        <DownloadOtherFiles { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadOther = wrapper.find( 'DownloadOtherFiles' );

    expect( downloadOther.html() ).toEqual( null );
  } );

  it( 'renders a "no other files available message" if there are no other files', async () => {
    const noFilesMocks = [
      {
        ...mocks[0],
        result: {
          data: {
            project: {
              ...mocks[0].result.data.project,
              files: []
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks } addTypename={ false }>
        <DownloadOtherFiles { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadOther = wrapper.find( 'DownloadOtherFiles' );
    const items = downloadOther.find( 'Item' );
    const { files } = noFilesMocks[0].result.data.project;
    const msg = 'There are no other files available for download at this time';

    expect( downloadOther.exists() ).toEqual( true );
    expect( items.length ).toEqual( files.length );
    expect( downloadOther.contains( msg ) ).toEqual( true );
  } );

  it( 'renders <a> tags with the correct href and download attribute values', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const items = wrapper.find( 'Item' );
    const { files } = mocks[0].result.data.project;
    const s3Bucket = 'https://s3-url.com';

    expect( items.length ).toEqual( files.length );
    items.forEach( ( item, i ) => {
      const { url: assetPath, filename } = files[i];
      expect( item.prop( 'href' ) ).toEqual( `${s3Bucket}/${assetPath}` );
      expect( item.prop( 'download' ) ).toEqual( filename );
    } );
  } );

  it( 'renders <span> tags with null href & download attributes if isPreview is true', async () => {
    const newProps = { ...props, isPreview: true };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DownloadOtherFiles { ...newProps } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const items = wrapper.find( '.item' );
    const { files } = mocks[0].result.data.project;

    expect( items.length ).toEqual( files.length );
    items.forEach( item => {
      expect( item.name() ).toEqual( 'span' );
      expect( item.prop( 'href' ) ).toEqual( null );
      expect( item.prop( 'download' ) ).toEqual( null );
    } );
  } );
} );
