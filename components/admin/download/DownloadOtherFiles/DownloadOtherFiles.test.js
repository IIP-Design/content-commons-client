import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { Loader } from 'semantic-ui-react';

import DownloadOtherFiles from './DownloadOtherFiles';

import { suppressActWarning } from 'lib/utils';
import {
  emptyProjectMocks,
  errorMocks,
  mocks,
  noFilesMocks,
  nullProjectMocks,
  props,
} from './mocks';

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );

jest.mock( 'lib/utils', () => ( {
  ...jest.requireActual( '../../../../lib/utils' ),
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

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <DownloadOtherFiles { ...props } />
  </MockedProvider>
);

describe( '<DownloadOtherFiles />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

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
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <DownloadOtherFiles { ...props } />
      </MockedProvider>,
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
    const wrapper = mount(
      <MockedProvider mocks={ nullProjectMocks } addTypename={ false }>
        <DownloadOtherFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadOther = wrapper.find( 'DownloadOtherFiles' );

    expect( downloadOther.html() ).toEqual( null );
  } );

  it( 'renders null if project is {}', async () => {
    // ignore console.warn about missing field `id` and `files`
    const consoleWarn = console.warn;

    console.warn = jest.fn();

    const wrapper = mount(
      <MockedProvider mocks={ emptyProjectMocks } addTypename={ false }>
        <DownloadOtherFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadOther = wrapper.find( 'DownloadOtherFiles' );

    expect( downloadOther.html() ).toEqual( null );
    console.warn = consoleWarn;
  } );

  it( 'renders a "no other files available message" if there are no other files', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks } addTypename={ false }>
        <DownloadOtherFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadOther = wrapper.find( 'DownloadOtherFiles' );
    const items = downloadOther.find( 'Item' );
    const { files, thumbnails } = noFilesMocks[0].result.data.project;
    const allFiles = [...thumbnails, ...files];
    const msg = 'There are no other files available for download at this time';

    expect( downloadOther.exists() ).toEqual( true );
    expect( items.length ).toEqual( allFiles.length );
    expect( downloadOther.contains( msg ) ).toEqual( true );
  } );

  it( 'renders <a> tags with the correct href and download attribute values', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const items = wrapper.find( 'DownloadItemContent' );
    const { files, thumbnails } = mocks[0].result.data.project;
    const allFiles = [...thumbnails, ...files];
    const s3Bucket = 'https://s3-url.com';

    expect( items.length ).toEqual( allFiles.length );
    items.forEach( ( item, i ) => {
      const { url: assetPath } = allFiles[i];

      expect( item.prop( 'srcUrl' ) ).toEqual( `${s3Bucket}/${assetPath}` );
      expect( item.find( '.download-item' ).prop( 'href' ) ).toEqual( 'https://example.jpg' );
      expect( item.find( '.download-item' ).prop( 'download' ) ).toEqual( true );
    } );
  } );

  it( 'renders preview text if isPreview is true', async () => {
    const newProps = { ...props, isPreview: true };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DownloadOtherFiles { ...newProps } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadOtherFiles = wrapper.find( 'DownloadOtherFiles' );
    const previews = downloadOtherFiles.find( '.preview-text' );
    const { files, thumbnails } = mocks[0].result.data.project;
    const allFiles = [...thumbnails, ...files];

    expect( previews.length ).toEqual( allFiles.length );
    previews.forEach( preview => {
      expect( preview.exists() )
        .toEqual( downloadOtherFiles.prop( 'isPreview' ) );
      expect( preview.name() ).toEqual( 'span' );
      expect( preview.text() )
        .toEqual( 'The link will be active after publishing.' );
    } );
  } );

  it( 'does not render preview text if !isPreview', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const downloadOtherFiles = wrapper.find( 'DownloadOtherFiles' );
    const previews = downloadOtherFiles.find( '.preview-text' );

    expect( previews.exists() )
      .toEqual( downloadOtherFiles.prop( 'isPreview' ) );
    expect( previews.length ).toEqual( 0 );
  } );
} );
