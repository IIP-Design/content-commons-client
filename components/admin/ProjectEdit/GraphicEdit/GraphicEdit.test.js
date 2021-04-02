import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import wait from 'waait';

import GraphicEdit from './GraphicEdit';

import { suppressActWarning } from 'lib/utils';
import {
  errorMocks,
  mocks,
  publishedMocks,
  props,
  getLocalAdditionalFiles,
  getLocalEditableFiles,
  localGraphicFiles,
  supportFilesConfig,
} from './testHelpers';

const router = {
  asPath: 'the-asPath',
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: {} } ) );

jest.mock( 'next/dynamic', () => () => 'GraphicProject' );

jest.mock(
  'components/admin/ActionButtons/ActionButtons',
  () => function ActionButtons() { return ''; },
);

jest.mock(
  'components/admin/ActionHeadline/ActionHeadline',
  () => function ActionHeadline() { return ''; },
);

jest.mock(
  'components/admin/ButtonPublish/ButtonPublish',
  () => function ButtonPublish() { return ''; },
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

describe( '<GraphicEdit />, when there is an existing DRAFT graphic project', () => {
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

  it( 'renders the final state without crashing', async () => {
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
    expect( toJSON( actionButtons ) ).toMatchSnapshot();
  } );

  it.skip( 'calling ActionButtons handle.deleteConfirm calls handleDeleteConfirm', async done => {
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
        top: '8em',
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

    expect( graphicFiles.exists() ).toEqual( true );
    expect( graphicFiles.prop( 'projectId' ) ).toEqual( props.id );
    expect( graphicFiles.prop( 'files' ) ).toEqual( images );
  } );

  it( 'renders the bottom of page buttons', async () => {
    await wait( 0 );
    wrapper.update();
    const actions = wrapper.find( '.actions' );
    const headline = actions.find( '.headline' );
    const modal = actions.find( 'Modal' );
    const modalTrigger = mount( modal.prop( 'trigger' ) );
    const btnPublish = actions.find( 'ButtonPublish' );

    expect( actions.exists() ).toEqual( true );
    expect( headline.props() ).toEqual( {
      className: 'headline',
      type: 'graphic project',
      published: false,
      updated: false,
    } );
    expect( modal.prop( 'content' ).props.children.type )
      .toEqual( 'GraphicProject' );
    expect( modalTrigger.name() ).toEqual( 'Button' );
    expect( modalTrigger.prop( 'className' ) )
      .toEqual( 'action-btn btn--preview' );
    expect( modalTrigger.prop( 'content' ) ).toEqual( 'Preview' );
    expect( modalTrigger.prop( 'primary' ) ).toEqual( true );
    expect( modalTrigger.prop( 'disabled' ) ).toEqual( !props.id );
    expect( btnPublish.prop( 'status' ) )
      .toEqual( mocks[0].result.data.graphicProject.status );
    expect( btnPublish.prop( 'disabled' ) ).toEqual( !props.id );
  } );
} );

describe( '<GraphicEdit />, when there is an existing PUBLISHED graphic project', () => {
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
      <MockedProvider mocks={ publishedMocks } resolvers={ {} } addTypename>
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

  it( 'renders the final state without crashing', async () => {
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
    expect( toJSON( actionButtons ) ).toMatchSnapshot();
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
        top: '8em',
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

    expect( graphicFiles.exists() ).toEqual( true );
    expect( graphicFiles.prop( 'projectId' ) ).toEqual( props.id );
    expect( graphicFiles.prop( 'files' ) ).toEqual( images );
  } );

  it( 'renders the bottom of page buttons', async () => {
    await wait( 0 );
    wrapper.update();
    const actions = wrapper.find( '.actions' );
    const headline = actions.find( '.headline' );
    const modal = actions.find( 'Modal' );
    const modalTrigger = mount( modal.prop( 'trigger' ) );
    const btnPublish = actions.find( 'ButtonPublish' );

    expect( actions.exists() ).toEqual( true );
    expect( headline.props() ).toEqual( {
      className: 'headline',
      type: 'graphic project',
      published: true,
      updated: false,
    } );
    expect( modal.prop( 'content' ).props.children.type )
      .toEqual( 'GraphicProject' );
    expect( modalTrigger.name() ).toEqual( 'Button' );
    expect( modalTrigger.prop( 'className' ) )
      .toEqual( 'action-btn btn--preview' );
    expect( modalTrigger.prop( 'content' ) ).toEqual( 'Preview' );
    expect( modalTrigger.prop( 'primary' ) ).toEqual( true );
    expect( modalTrigger.prop( 'disabled' ) ).toEqual( !props.id );
    expect( btnPublish.prop( 'status' ) )
      .toEqual( publishedMocks[0].result.data.graphicProject.status );
    expect( btnPublish.prop( 'disabled' ) ).toEqual( !props.id );
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

  it( 'renders without crashing', async () => {
    await wait( 0 );
    wrapper.update();

    expect( graphicEdit().exists() ).toEqual( true );
  } );

  it( 'does not render the bottom of page buttons', () => {
    const actions = wrapper.find( '.actions' );

    expect( actions.exists() ).toEqual( false );
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
    expect( toJSON( actionButtons ) ).toMatchSnapshot();
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
        top: '8em',
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
    const config = [
      {
        ...supportFilesConfig[0],
        files: getLocalEditableFiles(),
      },
      {
        ...supportFilesConfig[1],
        files: getLocalAdditionalFiles(),
      },
    ];

    expect( supportFiles.exists() ).toEqual( true );
    expect( supportFiles.prop( 'projectId' ) ).toEqual( newProps.id );
    config.forEach( ( obj, i ) => {
      expect( supportFiles.prop( 'fileTypes' )[i] ).toEqual( obj );
    } );
  } );

  it( 'renders the GraphicFilesFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const graphicFiles = wrapper.find( 'GraphicFilesFormContainer' );

    expect( graphicFiles.exists() ).toEqual( true );
    expect( graphicFiles.prop( 'projectId' ) ).toEqual( newProps.id );
    expect( graphicFiles.prop( 'files' ) ).toEqual( localGraphicFiles );
  } );
} );
