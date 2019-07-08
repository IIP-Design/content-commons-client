import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Loader } from 'semantic-ui-react';
import DownloadSrt, { VIDEO_PROJECT_PREVIEW_SRTS_QUERY } from './DownloadSrt';

jest.mock( 'lib/utils', () => ( {
  getPathToS3Bucket: jest.fn( () => {} ),
  getS3Url: jest.fn( assetPath => (
    `https://s3-url.com/${assetPath}`
  ) )
} ) );

jest.mock( 'static/icons/icon_download.svg', () => 'downloadIconSVG' );

const props = {
  id: '123',
  instructions: 'Download SRT(s)',
  isPreview: false
};

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_SRTS_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          id: props.id,
          files: [
            {
              id: 'srt89',
              url: `2019/06/${props.id}/srt-1.srt`,
              language: {
                id: 'en23',
                displayName: 'English'
              }
            },
            {
              id: 'srt99',
              url: `2019/06/${props.id}/srt-2.srt`,
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
    <DownloadSrt { ...props } />
  </MockedProvider>
);

describe( '<DownloadSrt />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const downloadSrt = wrapper.find( 'DownloadSrt' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading SRT(s)..."
      />
    );

    expect( downloadSrt.exists() ).toEqual( true );
    expect( downloadSrt.contains( loader ) ).toEqual( true );
    expect( toJSON( downloadSrt ) ).toMatchSnapshot();
  } );

  it( 'renders error message if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_SRTS_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <DownloadSrt { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const downloadSrt = wrapper.find( 'DownloadSrt' );
    const errorComponent = downloadSrt.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const downloadSrt = wrapper.find( 'DownloadSrt' );

    expect( toJSON( downloadSrt ) ).toMatchSnapshot();
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
        <DownloadSrt { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadSrt = wrapper.find( 'DownloadSrt' );

    expect( downloadSrt.html() ).toEqual( null );
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
        <DownloadSrt { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadSrt = wrapper.find( 'DownloadSrt' );

    expect( downloadSrt.html() ).toEqual( null );
  } );

  it( 'renders a "no SRTs available message" if there are no SRT files', async () => {
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
        <DownloadSrt { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadSrt = wrapper.find( 'DownloadSrt' );
    const items = downloadSrt.find( 'Item' );
    const { files } = noFilesMocks[0].result.data.project;
    const msg = 'There are no SRTs available for download at this time';

    expect( downloadSrt.exists() ).toEqual( true );
    expect( items.length ).toEqual( files.length );
    expect( downloadSrt.contains( msg ) ).toEqual( true );
  } );

  it( 'renders <a> tags with the correct href and download attribute values', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const items = wrapper.find( '.item' );
    const { files } = mocks[0].result.data.project;
    const s3Bucket = 'https://s3-url.com';

    expect( items.length ).toEqual( files.length );
    items.forEach( ( item, i ) => {
      const assetPath = files[i].url;
      expect( item.name() ).toEqual( 'a' );
      expect( item.prop( 'href' ) ).toEqual( `${s3Bucket}/${assetPath}` );
      expect( item.prop( 'download' ) )
        .toEqual( `${files[i].language.displayName}_SRT` );
    } );
  } );

  it( 'renders <span> tags with null href & download attributes if isPreview is true', async () => {
    const newProps = { ...props, isPreview: true };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DownloadSrt { ...newProps } />
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
