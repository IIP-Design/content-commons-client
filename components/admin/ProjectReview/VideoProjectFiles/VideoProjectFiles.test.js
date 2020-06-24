import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from '@apollo/react-testing';
import { Loader } from 'semantic-ui-react';

import VideoProjectFiles from './VideoProjectFiles';

import {
  errorMocks,
  mocks,
  noFilesMocks,
  noUnitsMocks,
  nullFilesMocks,
  nullMocks,
  nullUnitsMocks,
  props,
} from 'components/admin/Previews/ProjectPreview/ProjectPreviewContent/mocks';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

jest.mock( 'lib/utils', () => ( {
  getPluralStringOrNot: jest.fn( ( array, string ) => `${string}${array && array.length > 1 ? 's' : ''}` ),
  getApolloErrors: jest.fn( error => {
    let errs = [];
    const { graphQLErrors, networkError, otherError } = error;

    if ( graphQLErrors ) {
      errs = graphQLErrors.map( error => error.message );
    }
    if ( networkError ) errs.push( networkError );
    if ( otherError ) errs.push( otherError );

    return errs;
  } ),
} ) );

jest.mock( './VideoProjectFile/VideoProjectFile', () => 'video-project-file' );

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <VideoProjectFiles { ...props } />
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

describe( '<VideoProjectFiles />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading project file(s)..."
      />
    );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.contains( loader ) ).toEqual( true );
  } );

  it( 'renders error message if an error is thrown', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>,
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const errorComponent = videoProjectFiles.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders `null` if project is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'renders the final state', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( toJSON( videoProjectFiles ) ).toMatchSnapshot();
  } );

  it( 'clicking the Edit button redirects to <VideoEdit />', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const header = videoProjectFiles.find( '.project_file_header' );
    const editBtns = header.find( 'Button.project_button--edit' );

    Router.push = jest.fn();

    editBtns.forEach( btn => {
      const { id } = props;

      btn.simulate( 'click' );
      expect( Router.push ).toHaveBeenCalledWith( {
        pathname: '/admin/project',
        query: {
          id,
          content: 'video',
          action: 'edit',
        },
      }, `/admin/project/video/${id}/edit` );
    } );
  } );

  it( 'renders `null` if units is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullUnitsMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'renders `null` if units is `[]`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noUnitsMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'does not render VideoProjectFile if unit.files is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullFilesMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const videoProjectFile = videoProjectFiles.find( 'VideoProjectFile' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFile.exists() ).toEqual( false );
  } );

  it( 'does not render VideoProjectFile if unit.files is `[]`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks }>
        <VideoProjectFiles { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const videoProjectFile = videoProjectFiles.find( 'VideoProjectFile' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFile.exists() ).toEqual( false );
  } );
} );
