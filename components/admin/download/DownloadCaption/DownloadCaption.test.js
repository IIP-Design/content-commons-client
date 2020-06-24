import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { Loader } from 'semantic-ui-react';

import DownloadCaption from './DownloadCaption';

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
    <DownloadCaption { ...props } />
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

describe( '<DownloadCaption />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const downloadCaption = wrapper.find( 'DownloadCaption' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading Caption file(s)..."
      />
    );

    expect( downloadCaption.exists() ).toEqual( true );
    expect( downloadCaption.contains( loader ) ).toEqual( true );
    expect( toJSON( downloadCaption ) ).toMatchSnapshot();
  } );

  it( 'renders error message if error is thrown', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <DownloadCaption { ...props } />
      </MockedProvider>,
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const downloadCaption = wrapper.find( 'DownloadCaption' );
    const errorComponent = downloadCaption.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const downloadCaption = wrapper.find( 'DownloadCaption' );

    expect( toJSON( downloadCaption ) ).toMatchSnapshot();
  } );

  it( 'renders null if project is null', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullProjectMocks } addTypename={ false }>
        <DownloadCaption { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadCaption = wrapper.find( 'DownloadCaption' );

    expect( downloadCaption.html() ).toEqual( null );
  } );

  it( 'renders null if project is {}', async () => {
    // ignore console.warn about missing field `id` and `files`
    const consoleWarn = console.warn;

    console.warn = jest.fn();

    const wrapper = mount(
      <MockedProvider mocks={ emptyProjectMocks } addTypename={ false }>
        <DownloadCaption { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadCaption = wrapper.find( 'DownloadCaption' );

    expect( downloadCaption.html() ).toEqual( null );
    console.warn = consoleWarn;
  } );

  it( 'renders a "no caption files available message" if there are no caption files', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks } addTypename={ false }>
        <DownloadCaption { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadCaption = wrapper.find( 'DownloadCaption' );
    const items = downloadCaption.find( 'Item' );
    const { files } = noFilesMocks[0].result.data.project;
    const msg = 'There are no caption files available for download at this time';

    expect( downloadCaption.exists() ).toEqual( true );
    expect( items.length ).toEqual( files.length );
    expect( downloadCaption.contains( msg ) ).toEqual( true );
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
        <DownloadCaption { ...newProps } />
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
        <DownloadCaption { ...newProps } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const downloadCaption = wrapper.find( 'DownloadCaption' );
    const previews = downloadCaption.find( '.preview-text' );
    const { files } = mocks[0].result.data.project;

    expect( previews.length ).toEqual( files.length );
    previews.forEach( preview => {
      expect( preview.exists() )
        .toEqual( downloadCaption.prop( 'isPreview' ) );
      expect( preview.name() ).toEqual( 'span' );
      expect( preview.text() )
        .toEqual( 'The link will be active after publishing.' );
    } );
  } );

  it( 'does not render preview text if !isPreview', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const downloadCaption = wrapper.find( 'DownloadCaption' );
    const previews = downloadCaption.find( '.preview-text' );

    expect( previews.exists() )
      .toEqual( downloadCaption.prop( 'isPreview' ) );
    expect( previews.length ).toEqual( 0 );
  } );
} );
