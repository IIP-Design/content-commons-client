import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { Loader } from 'semantic-ui-react';

import DownloadThumbnail from './DownloadThumbnail';

import {
  emptyProjectMocks,
  errorMocks,
  mocks,
  noFilesMocks,
  nullProjectMocks,
  props,
} from './mocks';

jest.mock( 'lib/utils', () => ( {
  getS3Url: jest.fn( assetPath => `https://s3-url.com/${assetPath}` ),
  getApolloErrors: error => {
    let errs = [];
    const { graphQLErrors, networkError, otherError } = error;

    if ( graphQLErrors ) {
      errs = graphQLErrors.map( error => error.message );
    }
    if ( networkError ) {
      errs.push( networkError );
    }

    if ( otherError ) {
      errs.push( otherError );
    }

    return errs;
  },
} ) );

jest.mock( 'static/icons/icon_download.svg', () => 'downloadIconSVG' );

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <DownloadThumbnail { ...props } />
  </MockedProvider>
);

const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';

  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};

describe( '<DownloadThumbnail />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

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
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <DownloadThumbnail { ...props } />
      </MockedProvider>,
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
    const wrapper = mount(
      <MockedProvider mocks={ nullProjectMocks } addTypename={ false }>
        <DownloadThumbnail { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadThumb = wrapper.find( 'DownloadThumbnail' );

    expect( downloadThumb.html() ).toEqual( null );
  } );

  it( 'renders null if project is {}', async () => {
    // ignore console.warn about missing field `id` and `thumbnails`
    const consoleWarn = console.warn;

    console.warn = jest.fn();

    const wrapper = mount(
      <MockedProvider mocks={ emptyProjectMocks } addTypename={ false }>
        <DownloadThumbnail { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadThumb = wrapper.find( 'DownloadThumbnail' );

    expect( downloadThumb.html() ).toEqual( null );
    console.warn = consoleWarn;
  } );

  it( 'renders a "no thumbnails available message" if there are no thumbnail files', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks } addTypename={ false }>
        <DownloadThumbnail { ...props } />
      </MockedProvider>,
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

    const items = wrapper.find( 'DownloadItemContent' );
    const { thumbnails } = mocks[0].result.data.project;
    const s3Bucket = 'https://s3-url.com';

    expect( items.length ).toEqual( thumbnails.length );
    
    items.forEach( ( item, i ) => {
      const assetPath = thumbnails[i].url;
      expect( item.prop( 'srcUrl' ) ).toEqual( `${s3Bucket}/${assetPath}` );
      expect( item.find( '.download-item' ).prop( 'href' ) ).toEqual( 'https://example.jpg' );
      expect( item.find( '.download-item' ).prop( 'download' ) ).toEqual( true );
    } );
  } );

  it( 'renders preview text if isPreview is true', async () => {
    const newProps = { ...props, isPreview: true };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DownloadThumbnail { ...newProps } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadThumbnail = wrapper.find( 'DownloadThumbnail' );
    const previews = downloadThumbnail.find( '.preview-text' );
    const { thumbnails } = mocks[0].result.data.project;

    expect( previews.length ).toEqual( thumbnails.length );
    previews.forEach( preview => {
      expect( preview.exists() )
        .toEqual( downloadThumbnail.prop( 'isPreview' ) );
      expect( preview.name() ).toEqual( 'span' );
      expect( preview.text() )
        .toEqual( 'The link will be active after publishing.' );
    } );
  } );

  it( 'does not render preview text if !isPreview', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const downloadThumbnail = wrapper.find( 'DownloadThumbnail' );
    const previews = downloadThumbnail.find( '.preview-text' );

    expect( previews.exists() )
      .toEqual( downloadThumbnail.prop( 'isPreview' ) );
    expect( previews.length ).toEqual( 0 );
  } );
} );
