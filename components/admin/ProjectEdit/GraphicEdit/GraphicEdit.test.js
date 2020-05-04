import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { errorMocks, mocks, props } from './mocks';
import GraphicEdit from './GraphicEdit';

jest.mock(
  'components/admin/ActionButtons/ActionButtons',
  () => function ActionButtons() { return ''; }
);

jest.mock(
  'components/admin/ProjectDetailsForm/GraphicProjectDetailsFormContainer/GraphicProjectDetailsFormContainer',
  () => function GraphicProjectDetailsFormContainer() { return ''; }
);

jest.mock(
  'components/admin/ProjectEdit/GraphicEdit/GraphicSupportFilesContainer/GraphicSupportFilesContainer',
  () => function GraphicSupportFilesContainer() { return ''; }
);

jest.mock(
  'components/admin/ProjectEdit/GraphicEdit/GraphicFilesFormContainer/GraphicFilesFormContainer',
  () => function GraphicFilesFormContainer() { return ''; }
);

jest.mock(
  'components/Notification/Notification',
  () => function Notification() { return ''; }
);

jest.mock(
  'components/admin/ProjectEdit/UploadProgress/UploadProgress',
  () => function UploadProgress() { return ''; }
);

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <GraphicEdit { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename>
    <GraphicEdit { ...props } />
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

describe( '<GraphicEdit />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let wrapper;
  let graphicEdit;

  beforeEach( () => {
    wrapper = mount( Component );
    graphicEdit = () => wrapper.find( 'GraphicEdit' );
  } );

  it( 'renders initial loading state without crashing', () => {
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading project details page...';

    expect( wrapper.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( msg ) ).toEqual( true );
  } );

  it( 'renders error message if a queryError is returned', async () => {
    const errorWrapper = mount( ErrorComponent );

    await wait( 0 );
    errorWrapper.update();

    const apolloError = errorWrapper.find( 'ApolloError' );
    const msg = 'There was an error.';

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.contains( msg ) ).toEqual( true );
  } );

  it( 'renders renders the final state', async () => {
    await wait( 0 );
    wrapper.update();

    expect( graphicEdit().exists() ).toEqual( true );
    expect( toJSON( graphicEdit() ) ).toMatchSnapshot();
  } );

  it( 'renders renders ProjectHeader', async () => {
    await wait( 0 );
    wrapper.update();
    const projectHeader = wrapper.find( 'ProjectHeader' );

    expect( projectHeader.exists() ).toEqual( true );
    expect( projectHeader.prop( 'icon' ) ).toEqual( 'images outline' );
    expect( projectHeader.prop( 'text' ) ).toEqual( 'Project Details' );
  } );

  it( 'renders renders the ActionButtons', async () => {
    await wait( 0 );
    wrapper.update();
    const actionButtons = wrapper.find( 'ActionButtons' );

    expect( actionButtons.exists() ).toEqual( true );
  } );

  it( 'renders renders the Notification', async () => {
    await wait( 0 );
    wrapper.update();
    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( true );
    expect( notification.props() ).toEqual( {
      el: 'p',
      customStyles: {
        position: 'absolute',
        top: '9em',
        left: '50%',
        transform: 'translateX(-50%)'
      },
      show: false,
      msg: ''
    } );
  } );

  it( 'renders renders the UploadProgress', async () => {
    await wait( 0 );
    wrapper.update();
    const uploadProgress = wrapper.find( 'UploadProgress' );

    expect( uploadProgress.exists() ).toEqual( true );
    expect( uploadProgress.length ).toEqual( 2 );
  } );

  it( 'renders renders the GraphicProjectDetailsFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const detailsForm = wrapper.find( 'GraphicProjectDetailsFormContainer' );

    expect( detailsForm.exists() ).toEqual( true );
    expect( detailsForm.prop( 'id' ) ).toEqual( props.id );
    expect( detailsForm.prop( 'contentStyle' ) ).toEqual( {
      border: '3px solid transparent'
    } );
    // expect( detailsForm.prop( 'data' ) ).toEqual( mocks[0].data );
  } );

  it( 'renders renders the GraphicSupportFilesContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const supportFiles = wrapper.find( 'GraphicSupportFilesContainer' );

    expect( supportFiles.exists() ).toEqual( true );
    expect( supportFiles.prop( 'projectId' ) ).toEqual( props.id );
  } );

  it( 'renders renders the GraphicFilesFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const graphicFiles = wrapper.find( 'GraphicFilesFormContainer' );

    expect( graphicFiles.exists() ).toEqual( true );
    expect( graphicFiles.prop( 'projectId' ) ).toEqual( props.id );
  } );
} );
