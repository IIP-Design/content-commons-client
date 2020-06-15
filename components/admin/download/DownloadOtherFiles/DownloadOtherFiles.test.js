import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { Loader } from 'semantic-ui-react';

import DownloadOtherFiles from './DownloadOtherFiles';

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

    const items = wrapper.find( '.item' );
    const { files } = mocks[0].result.data.project;
    const s3Bucket = 'https://s3-url.com';

    expect( items.length ).toEqual( files.length );
    items.forEach( ( item, i ) => {
      const { url: assetPath, filename } = files[i];

      expect( item.name() ).toEqual( 'a' );
      expect( item.prop( 'href' ) ).toEqual( `${s3Bucket}/${assetPath}` );
      expect( item.prop( 'download' ) ).toEqual( filename );
    } );
  } );

  it( 'renders <span> tags with null href & download attributes if isPreview is true', async () => {
    const newProps = { ...props, isPreview: true };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DownloadOtherFiles { ...newProps } />
      </MockedProvider>,
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
    const { files } = mocks[0].result.data.project;

    expect( previews.length ).toEqual( files.length );
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
