import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Loader } from 'semantic-ui-react';
import DownloadThumbnail, { VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY } from './DownloadThumbnail';

jest.mock( 'lib/utils', () => ( {
  getPathToS3Bucket: jest.fn( () => {} ),
  getS3Url: jest.fn( assetPath => (
    `https://s3-url.com/${assetPath}`
  ) )
} ) );

jest.mock( 'static/icons/icon_download.svg', () => 'downloadIconSVG' );

const props = {
  id: '123',
  instructions: 'Download Thumbnail(s)',
  isPreview: false
};

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          id: props.id,
          thumbnails: [
            {
              id: 'th765',
              url: `2019/06/${props.id}/thumbnail-1.jpg`,
              language: {
                id: 'en23',
                displayName: 'English'
              }
            },
            {
              id: 'th865',
              url: `2019/06/${props.id}/thumbnail-2.jpg`,
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
    <DownloadThumbnail { ...props } />
  </MockedProvider>
);

describe( '<DownloadThumbnail />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const downloadThumb = wrapper.find( 'DownloadThumbnail' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading thumbnail(s)..."
      />
    );

    expect( downloadThumb.exists() ).toEqual( true );
    expect( downloadThumb.contains( loader ) ).toEqual( true );
    expect( toJSON( downloadThumb ) ).toMatchSnapshot();
  } );

  it( 'renders error message if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <DownloadThumbnail { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const downloadThumb = wrapper.find( 'DownloadThumbnail' );
    const errorComponent = downloadThumb.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const downloadThumb = wrapper.find( 'DownloadThumbnail' );

    expect( toJSON( downloadThumb ) ).toMatchSnapshot();
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
        <DownloadThumbnail { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadThumb = wrapper.find( 'DownloadThumbnail' );

    expect( downloadThumb.html() ).toEqual( null );
  } );

  it( 'renders null if project is {}', async () => {
    // ignore console.warn about missing field `id` and `thumbnails`
    const emptyProjectMocks = [
      {
        ...mocks[0],
        result: { data: { project: {} } }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ emptyProjectMocks } addTypename={ false }>
        <DownloadThumbnail { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadThumb = wrapper.find( 'DownloadThumbnail' );

    expect( downloadThumb.html() ).toEqual( null );
  } );

  it( 'renders a "no thumbnails available message" if there are no thumbnail files', async () => {
    const noFilesMocks = [
      {
        ...mocks[0],
        result: {
          data: {
            project: {
              ...mocks[0].result.data.project,
              thumbnails: []
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks } addTypename={ false }>
        <DownloadThumbnail { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const downloadThumb = wrapper.find( 'DownloadThumbnail' );
    const items = downloadThumb.find( 'Item' );
    const { thumbnails } = noFilesMocks[0].result.data.project;
    const msg = 'There are no thumbnails available for download at this time';

    expect( downloadThumb.exists() ).toEqual( true );
    expect( items.length ).toEqual( thumbnails.length );
    expect( downloadThumb.contains( msg ) ).toEqual( true );
  } );

  it( 'renders <a> tags with the correct href and download attribute values', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const items = wrapper.find( 'Item' );
    const { thumbnails } = mocks[0].result.data.project;
    const s3Bucket = 'https://s3-url.com';

    expect( items.length ).toEqual( thumbnails.length );
    items.forEach( ( item, i ) => {
      const assetPath = thumbnails[i].url;
      expect( item.prop( 'href' ) ).toEqual( `${s3Bucket}/${assetPath}` );
      expect( item.prop( 'download' ) )
        .toEqual( `${thumbnails[i].language.displayName}_thumbnail` );
    } );
  } );

  it( 'renders <span> tags with null href & download attributes if isPreview is true', async () => {
    const newProps = { ...props, isPreview: true };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DownloadThumbnail { ...newProps } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const downloadThumbnail = wrapper.find( 'DownloadThumbnail' );
    const items = downloadThumbnail.find( '.item' );
    const { thumbnails } = mocks[0].result.data.project;

    expect( items.length ).toEqual( thumbnails.length );
    items.forEach( item => {
      expect( item.name() ).toEqual( 'span' );
      expect( item.prop( 'href' ) ).toEqual( null );
      expect( item.prop( 'download' ) ).toEqual( null );
    } );
  } );
} );
