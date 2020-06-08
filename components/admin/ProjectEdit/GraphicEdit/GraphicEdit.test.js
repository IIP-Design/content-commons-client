import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import {
  errorMocks,
  mocks,
  props,
  getGraphicFiles,
  getSupportFiles,
  suppressActWarning,
} from './testHelpers';
import GraphicEdit from './GraphicEdit';

const router = {
  asPath: 'the-asPath',
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock(
  'components/admin/ActionButtons/ActionButtons',
  () => function ActionButtons() { return ''; },
);

jest.mock(
  'components/admin/ProjectDetailsForm/GraphicProjectDetailsFormContainer/GraphicProjectDetailsFormContainer',
  () => function GraphicProjectDetailsFormContainer() { return ''; },
);

jest.mock(
  'components/admin/ProjectEdit/GraphicEdit/SupportFiles/SupportFiles',
  () => function SupportFiles() { return ''; },
);

jest.mock(
  'components/admin/ProjectEdit/GraphicEdit/GraphicFilesFormContainer/GraphicFilesFormContainer',
  () => function GraphicFilesFormContainer() { return ''; },
);

jest.mock(
  'components/Notification/Notification',
  () => function Notification() { return ''; },
);

jest.mock(
  'components/admin/ProjectEdit/UploadProgress/UploadProgress',
  () => function UploadProgress() { return ''; },
);

describe( '<GraphicEdit />, when there is an existing graphic project', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let Component;
  let ErrorComponent;
  let wrapper;
  let graphicEdit;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ mocks } resolvers={ {} } addTypename>
        <RouterContext.Provider value={ router }>
          <GraphicEdit { ...props } />
        </RouterContext.Provider>
      </MockedProvider>
    );

    ErrorComponent = (
      <MockedProvider mocks={ errorMocks } resolvers={ {} } addTypename>
        <RouterContext.Provider value={ router }>
          <GraphicEdit { ...props } />
        </RouterContext.Provider>
      </MockedProvider>
    );
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

  it( 'renders the final state', async () => {
    await wait( 0 );
    wrapper.update();

    expect( graphicEdit().exists() ).toEqual( true );
    expect( toJSON( graphicEdit() ) ).toMatchSnapshot();
  } );

  it( 'renders ProjectHeader', async () => {
    await wait( 0 );
    wrapper.update();
    const projectHeader = wrapper.find( 'ProjectHeader' );

    expect( projectHeader.exists() ).toEqual( true );
    expect( projectHeader.prop( 'icon' ) ).toEqual( 'images outline' );
    expect( projectHeader.prop( 'text' ) ).toEqual( 'Project Details' );
  } );

  it( 'renders the ActionButtons', async () => {
    await wait( 0 );
    wrapper.update();
    const actionButtons = wrapper.find( 'ActionButtons' );

    expect( actionButtons.exists() ).toEqual( true );
  } );

  it( 'calling ActionButtons handle.deleteConfirm calls handleDeleteConfirm', async done => {
    await wait( 0 );
    wrapper.update();
    const actionButtons = wrapper.find( 'ActionButtons' );

    // Redirect is a side effect of project deletion.
    const deleteConfirmTest = async () => {
      actionButtons.prop( 'handle' ).deleteConfirm();
      await wait( 4 ); // wait for mutation to resolve
      wrapper.update();

      expect( router.push ).toHaveBeenCalledWith( {
        pathname: '/admin/dashboard',
      } );
      done();
    };

    deleteConfirmTest();
  } );

  it( 'calling ActionButtons handle.save calls handleExit', async () => {
    await wait( 0 );
    wrapper.update();
    const actionButtons = wrapper.find( 'ActionButtons' );

    actionButtons.prop( 'handle' ).save();
    expect( router.push ).toHaveBeenCalledWith( {
      pathname: '/admin/dashboard',
    } );
  } );

  it( 'renders the Notification', async () => {
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
        transform: 'translateX(-50%)',
      },
      show: false,
      msg: '',
    } );
  } );

  it( 'renders the UploadProgress', async () => {
    await wait( 0 );
    wrapper.update();
    const uploadProgress = wrapper.find( 'UploadProgress' );

    expect( uploadProgress.exists() ).toEqual( true );
    expect( uploadProgress.length ).toEqual( 2 );
  } );

  it( 'renders the GraphicProjectDetailsFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const detailsForm = wrapper.find( 'GraphicProjectDetailsFormContainer' );

    expect( detailsForm.exists() ).toEqual( true );
    expect( detailsForm.prop( 'id' ) ).toEqual( props.id );
    expect( detailsForm.prop( 'contentStyle' ) ).toEqual( {
      border: '3px solid transparent',
    } );
  } );

  it( 'renders the SupportFiles', async () => {
    await wait( 0 );
    wrapper.update();
    const supportFiles = wrapper.find( 'SupportFiles' );
    const { data } = mocks[0].result;
    const projectId = props.id;
    const supportFilesConfig = [
      {
        headline: 'editable files',
        helperText: 'Original files that may be edited and adapted as needed for reuse.',
        files: getSupportFiles( {
          data,
          type: 'editable',
          projectId,
        } ),
      },
      {
        headline: 'additional files',
        helperText: 'Additional files may include transcript files, style guides, or other support files needed by internal staff in order to properly use these graphics.',
        files: getSupportFiles( {
          data,
          type: 'additional',
          projectId,
        } ),
      },
    ];

    expect( supportFiles.exists() ).toEqual( true );
    expect( supportFiles.prop( 'projectId' ) ).toEqual( props.id );
    supportFilesConfig.forEach( ( config, i ) => {
      expect( supportFiles.prop( 'fileTypes' )[i] ).toEqual( config );
    } );
  } );

  it( 'renders the GraphicFilesFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const graphicFiles = wrapper.find( 'GraphicFilesFormContainer' );
    const { images } = mocks[0].result.data.graphicProject;
    const projectId = props.id;

    expect( graphicFiles.exists() ).toEqual( true );
    expect( graphicFiles.prop( 'projectId' ) ).toEqual( props.id );
    expect( graphicFiles.prop( 'files' ) )
      .toEqual( getGraphicFiles( {
        images,
        localFiles: undefined,
        projectId,
      } ) );
  } );
} );

describe( '<GraphicEdit />, when there is no props.id and local files have been selected for upload', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let Component;
  let wrapper;
  let graphicEdit;

  const newProps = {
    id: undefined,
  };

  /**
   * Pass local resolvers to MockedProvider to suppress
   * "Found @client directives in a query but no ApolloClient
   * resolvers were specified. This means ApolloClient local
   * resolver handling has been disabled, and @client directives
   * will be passed through to your link chain."
   * @see https://github.com/apollographql/apollo-client/issues/4520#issuecomment-470557690
   */
  const resolvers = {
    Query: {
      localGraphicProject: () => ( {
        __typename: 'LocalGraphicProject',
        files: mocks[2].result.data.localGraphicProject.files,
      } ),
    },
  };

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ mocks } resolvers={ resolvers } addTypename>
        <RouterContext.Provider value={ router }>
          <GraphicEdit { ...newProps } />
        </RouterContext.Provider>
      </MockedProvider>
    );

    wrapper = mount( Component );
    graphicEdit = () => wrapper.find( 'GraphicEdit' );
  } );

  it( 'renders the final state', async () => {
    await wait( 0 );
    wrapper.update();

    expect( graphicEdit().exists() ).toEqual( true );
  } );

  it( 'renders ProjectHeader', async () => {
    await wait( 0 );
    wrapper.update();
    const projectHeader = wrapper.find( 'ProjectHeader' );

    expect( projectHeader.exists() ).toEqual( true );
    expect( projectHeader.prop( 'icon' ) ).toEqual( 'images outline' );
    expect( projectHeader.prop( 'text' ) ).toEqual( 'Project Details' );
  } );

  it( 'renders the ActionButtons', async () => {
    await wait( 0 );
    wrapper.update();
    const actionButtons = wrapper.find( 'ActionButtons' );

    expect( actionButtons.exists() ).toEqual( true );
  } );

  it( 'renders the Notification', async () => {
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
        transform: 'translateX(-50%)',
      },
      show: false,
      msg: '',
    } );
  } );

  it( 'renders the UploadProgress', async () => {
    await wait( 0 );
    wrapper.update();
    const uploadProgress = wrapper.find( 'UploadProgress' );

    expect( uploadProgress.exists() ).toEqual( true );
    expect( uploadProgress.length ).toEqual( 2 );
  } );

  it( 'renders the GraphicProjectDetailsFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const detailsForm = wrapper.find( 'GraphicProjectDetailsFormContainer' );

    expect( detailsForm.exists() ).toEqual( true );
    expect( detailsForm.prop( 'id' ) ).toEqual( newProps.id );
    expect( detailsForm.prop( 'contentStyle' ) ).toEqual( {
      border: '3px solid #02bfe7',
    } );
  } );

  it( 'renders the SupportFiles', async () => {
    await wait( 0 );
    wrapper.update();
    const supportFiles = wrapper.find( 'SupportFiles' );
    const { data } = mocks[2].result;
    const projectId = newProps.id;
    const supportFilesConfig = [
      {
        headline: 'editable files',
        helperText: 'Original files that may be edited and adapted as needed for reuse.',
        files: getSupportFiles( {
          data,
          type: 'editable',
          projectId,
        } ),
      },
      {
        headline: 'additional files',
        helperText: 'Additional files may include transcript files, style guides, or other support files needed by internal staff in order to properly use these graphics.',
        files: getSupportFiles( {
          data,
          type: 'additional',
          projectId,
        } ),
      },
    ];

    expect( supportFiles.exists() ).toEqual( true );
    expect( supportFiles.prop( 'projectId' ) ).toEqual( newProps.id );
    supportFilesConfig.forEach( ( config, i ) => {
      expect( supportFiles.prop( 'fileTypes' )[i] ).toEqual( config );
    } );
  } );

  it( 'renders the GraphicFilesFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const graphicFiles = wrapper.find( 'GraphicFilesFormContainer' );
    const { files: localFiles } = mocks[2].result.data.localGraphicProject;
    const projectId = newProps.id;

    expect( graphicFiles.exists() ).toEqual( true );
    expect( graphicFiles.prop( 'projectId' ) ).toEqual( newProps.id );
    expect( graphicFiles.prop( 'files' ) )
      .toEqual( getGraphicFiles( {
        images: undefined,
        localFiles,
        projectId,
      } ) );
  } );
} );
