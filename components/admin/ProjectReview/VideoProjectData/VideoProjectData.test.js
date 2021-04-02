import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/client/testing';
import { Icon, Loader } from 'semantic-ui-react';

import VideoProjectData from './VideoProjectData';

import { suppressActWarning } from 'lib/utils';
import {
  emptyAuthorTeamMocks,
  emptyCatTagsMocks,
  errorMocks,
  mocks,
  nullAuthorTeamMocks,
  nullCatTagsMocks,
  nullMocks,
  props,
} from './mocks';

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VideoProjectData { ...props } />
  </MockedProvider>
);

describe( '<VideoProjectData />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it.skip( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoProjectData = wrapper.find( 'VideoProjectData' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading project data..."
      />
    );

    expect( videoProjectData.exists() ).toEqual( true );
    expect( videoProjectData.contains( loader ) ).toEqual( true );
    expect( toJSON( videoProjectData ) ).toMatchSnapshot();
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks }>
        <VideoProjectData { ...props } />
      </MockedProvider>,
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );
    const div = videoProjectData
      .find( 'div.video-project-data.error' );
    const icon = <Icon color="red" name="exclamation triangle" />;
    const span = <span>Loading error...</span>;

    expect( div.exists() ).toEqual( true );
    expect( videoProjectData.contains( icon ) )
      .toEqual( true );
    expect( videoProjectData.contains( span ) )
      .toEqual( true );
  } );

  it( 'renders `null` if project is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks }>
        <VideoProjectData { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );

    expect( videoProjectData.html() ).toEqual( null );
  } );

  it.skip( 'renders the final state', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );

    expect( toJSON( videoProjectData ) ).toMatchSnapshot();
  } );

  it( 'does not crash if categories and tags are `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullCatTagsMocks } addTypename={ false }>
        <VideoProjectData { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );
    const taxonomySection = videoProjectData.find( 'section.project-data_taxonomy' );

    expect( videoProjectData.exists() ).toEqual( true );
    expect( toJSON( taxonomySection ) ).toMatchSnapshot();
  } );

  it( 'does not crash if categories and tags are `[]`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ emptyCatTagsMocks } addTypename={ false }>
        <VideoProjectData { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );
    const taxonomySection = videoProjectData.find( 'section.project-data_taxonomy' );

    expect( videoProjectData.exists() ).toEqual( true );
    expect( toJSON( taxonomySection ) ).toMatchSnapshot();
  } );

  it( 'does not crash if author and team are `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullAuthorTeamMocks } addTypename={ false }>
        <VideoProjectData { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );
    const metaSection = videoProjectData.find( 'section.project-data_meta' );

    expect( videoProjectData.exists() ).toEqual( true );
    expect( toJSON( metaSection ) ).toMatchSnapshot();
  } );

  it( 'does not crash if author and team are `{}`', async () => {
    // ignore console.warn about missing field
    const consoleWarn = console.warn;

    console.warn = jest.fn();

    const wrapper = mount(
      <MockedProvider mocks={ emptyAuthorTeamMocks } addTypename={ false }>
        <VideoProjectData { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );
    const metaSection = videoProjectData.find( 'section.project-data_meta' );

    expect( videoProjectData.exists() ).toEqual( true );
    expect( toJSON( metaSection ) ).toMatchSnapshot();
    console.warn = consoleWarn;
  } );
} );
