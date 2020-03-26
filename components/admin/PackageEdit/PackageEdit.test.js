import { mount } from 'enzyme';
import { MockedProvider, wait } from '@apollo/react-testing';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import PackageEdit from './PackageEdit';
import {
  errorMocks, mocks, noDocumentsMocks, props, undefinedDataMocks
} from './mocks';

jest.mock( 'next/dynamic', () => () => 'Press-Package-File' );
jest.mock(
  'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsFormContainer',
  () => function PackageDetailsFormContainer() {
    return 'PackageFiles';
  }
);
jest.mock(
  'components/admin/ActionHeadline/ActionHeadline',
  () => function ActionHeadline() { return ''; }
);
jest.mock(
  'components/admin/ButtonPublish/ButtonPublish',
  () => function ButtonPublish() { return ''; }
);
jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

const getBtn = ( str, buttons ) => (
  buttons.findWhere( n => n.text() === str && n.name() === 'button' )
);

const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';
  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};

describe( '<PackageEdit />', () => {
  const router = {
    push: jest.fn(),
    query: {
      id: 'test-123'
    }
  };

  let Component;
  let ErrorComponent;
  let wrapper;
  let actionButtons;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ mocks }>
        <RouterContext.Provider value={ router }>
          <PackageEdit { ...props } />
        </RouterContext.Provider>
      </MockedProvider>
    );

    ErrorComponent = (
      <MockedProvider mocks={ errorMocks }>
        <RouterContext.Provider value={ router }>
          <PackageEdit { ...props } />
        </RouterContext.Provider>
      </MockedProvider>
    );

    wrapper = mount( Component );
    actionButtons = () => wrapper.find( 'ActionButtons' );
  } );

  /**
   * @todo Suppress React 16.8 `act()` warnings globally.
   * The React team's fix won't be out of alpha until 16.9.0.
   * @see https://github.com/facebook/react/issues/14769
   */
  const consoleError = console.error;
  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders initial loading state without crashing', () => {
    const pkgEdit = wrapper.find( 'PackageEdit' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading package details page...';

    expect( pkgEdit.exists() ).toEqual( true );
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
    const pkgEdit = wrapper.find( 'PackageEdit' );

    expect( pkgEdit.exists() ).toEqual( true );
  } );

  it( 'renders the ProjectHeader', async () => {
    await wait( 0 );
    wrapper.update();

    const projectHeader = wrapper.find( 'ProjectHeader' );
    const icon = wrapper.find( 'Icon[name="file"]' );
    const title = 'Package Details';

    expect( projectHeader.exists() ).toEqual( true );
    expect( icon.exists() ).toEqual( true );
    expect( projectHeader.contains( title ) ).toEqual( true );
  } );

  it( 'renders the ActionButtons', async () => {
    await wait( 0 );
    wrapper.update();

    const btns = ['delete', 'save', 'publish'];
    const handleKeys = ['deleteConfirm', 'save', 'publish'];
    const handleFns = ['handleDeleteConfirm', 'handleExit', 'handlePublish'];

    expect( actionButtons().exists() ).toEqual( true );
    expect( actionButtons().prop( 'type' ) ).toEqual( 'package' );
    expect( typeof actionButtons().prop( 'setDeleteConfirmOpen' ) )
      .toEqual( 'function' );
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( false );
    handleKeys.forEach( ( key, i ) => {
      expect( actionButtons().prop( 'handle' )[key].name )
        .toEqual( handleFns[i] );
    } );
    btns.forEach( btn => {
      expect( actionButtons().prop( 'disabled' )[btn] ).toEqual( false );
      expect( actionButtons().prop( 'show' )[btn] ).toEqual( true );
    } );
  } );

  it( 'clicking the Delete Package button opens the Confirm modal', async () => {
    await wait( 0 );
    wrapper.update();

    const confirm = () => wrapper.find( 'Confirm' );
    const btns = actionButtons().find( 'button' );

    // closed initially
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( false );
    expect( confirm().prop( 'open' ) ).toEqual( false );

    // open the modal
    const deleteBtn = getBtn( 'Delete Package', btns );
    deleteBtn.simulate( 'click' );
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( true );
    expect( confirm().prop( 'open' ) ).toEqual( true );
  } );

  it( 'clicking the Cancel button in the Confirm modal closes the modal', async () => {
    await wait( 0 );
    wrapper.update();

    const confirm = () => wrapper.find( 'Confirm' );
    const btns = actionButtons().find( 'button' );

    // closed initially
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( false );
    expect( confirm().prop( 'open' ) ).toEqual( false );

    // open the modal
    const deleteBtn = getBtn( 'Delete Package', btns );
    deleteBtn.simulate( 'click' );
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( true );
    expect( confirm().prop( 'open' ) ).toEqual( true );

    // cancel delete and close modal
    const cancelBtn = getBtn( 'No, take me back', confirm().find( 'button' ) );
    cancelBtn.simulate( 'click' );
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( false );
    expect( confirm().prop( 'open' ) ).toEqual( false );
  } );

  it( 'clicking the Confirm button in the Confirm modal calls deletePackage and redirects to the dashboard', async done => {
    await wait( 0 );
    wrapper.update();

    const confirm = () => wrapper.find( 'Confirm' );
    const btns = actionButtons().find( 'button' );

    // closed initially
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( false );
    expect( confirm().prop( 'open' ) ).toEqual( false );

    // open the modal
    const deleteBtn = getBtn( 'Delete Package', btns );
    deleteBtn.simulate( 'click' );
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( true );
    expect( confirm().prop( 'open' ) ).toEqual( true );

    // Redirect is a side effect of package deletion.
    const confirmBtnTest = async () => {
      const confirmBtn = getBtn( 'Yes, delete forever', confirm().find( 'button' ) );
      confirmBtn.simulate( 'click' );
      await wait( 0 );
      wrapper.update();

      expect( router.push ).toHaveBeenCalledWith( {
        pathname: '/admin/dashboard'
      } );
      done();
    };

    confirmBtnTest();
  } );

  it( 'clicking the Save & Exit button redirects to the dashboard', async () => {
    await wait( 0 );
    wrapper.update();

    const btns = actionButtons().find( 'button' );
    const saveBtn = getBtn( 'Save & Exit', btns );

    saveBtn.simulate( 'click' );
    expect( router.push ).toHaveBeenCalledWith( {
      pathname: '/admin/dashboard'
    } );
  } );

  it.skip( 'clicking the Publish button ... TBD', async () => {
    await wait( 0 );
    wrapper.update();

    const btns = actionButtons().find( 'button' );
    const publishBtn = getBtn( 'Publish', btns );

    publishBtn.simulate( 'click' );

    // TBD
  } );

  it.skip( 'clicking the Unpublish button ... TBD', async () => {
    await wait( 0 );
    wrapper.update();

    const btns = actionButtons().find( 'button' );
    const unPublishBtn = getBtn( 'Unpublish', btns );

    unPublishBtn.simulate( 'click' );

    // TBD
  } );

  it( 'renders the PackageDetailsFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const pkgFormContainer = wrapper.find( 'PackageDetailsFormContainer' );
    const { pkg } = mocks[0].result.data;

    expect( pkgFormContainer.exists() ).toEqual( true );
    expect( pkgFormContainer.prop( 'pkg' ) ).toEqual( pkg );
    expect( typeof pkgFormContainer.prop( 'updateNotification' ) )
      .toEqual( 'function' );
    expect( pkgFormContainer.prop( 'updateNotification' ).name )
      .toEqual( 'updateNotification' );
    expect( typeof pkgFormContainer.prop( 'setIsFormValid' ) )
      .toEqual( 'function' );
    expect( pkgFormContainer.prop( 'setIsFormValid' ).name )
      .toEqual( 'bound dispatchAction' );
    expect( pkgFormContainer.prop( 'hasInitialUploadCompleted' ) )
      .toEqual( router.query.action !== 'create' );
  } );

  it( 'renders ActionHeadline', async () => {
    await wait( 0 );
    wrapper.update();

    const actionHeadline = wrapper.find( 'ActionHeadline' );
    const { pkg } = mocks[0].result.data;
    const isPublished = pkg.status === 'PUBLISHED';

    expect( actionHeadline.exists() ).toEqual( true );
    expect( actionHeadline.props() ).toEqual( {
      className: 'headline',
      type: 'package',
      published: isPublished,
      updated: isPublished
    } );
  } );

  it( 'renders ButtonPublish', async () => {
    await wait( 0 );
    wrapper.update();

    const buttonPublish = wrapper.find( 'ButtonPublish' );
    const { pkg } = mocks[0].result.data;

    expect( buttonPublish.exists() ).toEqual( true );
    expect( buttonPublish.prop( 'status' ) ).toEqual( pkg.status );
    expect( buttonPublish.prop( 'publishing' ) ).toEqual( undefined );
    expect( buttonPublish.prop( 'updated' ) )
      .toEqual( pkg.status === 'PUBLISHED' );
    expect( buttonPublish.prop( 'handlePublish' ).name )
      .toEqual( 'handlePublish' );
    expect( buttonPublish.prop( 'handleUnPublish' ).name )
      .toEqual( 'handleUnPublish' );
  } );

  it( 'renders ApolloError with an empty error prop', async () => {
    await wait( 0 );
    wrapper.update();
    const apolloErrors = wrapper.find( 'ApolloError' );

    expect( apolloErrors.exists() ).toEqual( true );
    expect( apolloErrors.length ).toEqual( 2 );
    apolloErrors.forEach( apolloError => {
      expect( apolloError.prop( 'error' ) ).toEqual( {} );
    } );
  } );

  it( 'renders Notification with the correct initial props', async () => {
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
} );

describe( '<PackageEdit />, if there are no documents,', () => {
  const router = {
    push: jest.fn(),
    query: {
      id: 'test-123',
      action: 'create'
    }
  };

  let Component;
  let ErrorComponent;
  let wrapper;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ noDocumentsMocks }>
        <RouterContext.Provider value={ router }>
          <PackageEdit { ...props } />
        </RouterContext.Provider>
      </MockedProvider>
    );

    ErrorComponent = (
      <MockedProvider mocks={ errorMocks }>
        <RouterContext.Provider value={ router }>
          <PackageEdit { ...props } />
        </RouterContext.Provider>
      </MockedProvider>
    );

    wrapper = mount( Component );
  } );

  const consoleError = console.error;
  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders initial loading state without crashing', () => {
    const pkgEdit = wrapper.find( 'PackageEdit' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading package details page...';

    expect( pkgEdit.exists() ).toEqual( true );
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
    const pkgEdit = wrapper.find( 'PackageEdit' );

    expect( pkgEdit.exists() ).toEqual( true );
  } );

  it( 'renders the ProjectHeader', async () => {
    await wait( 0 );
    wrapper.update();

    const projectHeader = wrapper.find( 'ProjectHeader' );
    const icon = wrapper.find( 'Icon[name="file"]' );
    const title = 'Package Details';

    expect( projectHeader.exists() ).toEqual( true );
    expect( icon.exists() ).toEqual( true );
    expect( projectHeader.contains( title ) ).toEqual( true );
  } );

  it( 'does not render PackageActions', async () => {
    await wait( 0 );
    wrapper.update();
    const pkgActions = wrapper.find( 'PackageActions' );

    expect( pkgActions.exists() ).toEqual( false );
  } );

  it( 'renders the PackageDetailsFormContainer', async () => {
    await wait( 0 );
    wrapper.update();
    const pkgFormContainer = wrapper.find( 'PackageDetailsFormContainer' );
    const { pkg } = noDocumentsMocks[0].result.data;

    expect( pkgFormContainer.exists() ).toEqual( true );
    expect( pkgFormContainer.prop( 'pkg' ) ).toEqual( pkg );
    expect( typeof pkgFormContainer.prop( 'updateNotification' ) )
      .toEqual( 'function' );
    expect( pkgFormContainer.prop( 'updateNotification' ).name )
      .toEqual( 'updateNotification' );
    expect( typeof pkgFormContainer.prop( 'setIsFormValid' ) )
      .toEqual( 'function' );
    expect( pkgFormContainer.prop( 'setIsFormValid' ).name )
      .toEqual( 'bound dispatchAction' );
    expect( pkgFormContainer.prop( 'hasInitialUploadCompleted' ) )
      .toEqual( router.query.action !== 'create' );
  } );

  it( 'renders ApolloError with an empty error prop', async () => {
    await wait( 0 );
    wrapper.update();
    const apolloErrors = wrapper.find( 'ApolloError' );

    expect( apolloErrors.exists() ).toEqual( true );
    expect( apolloErrors.length ).toEqual( 2 );
    apolloErrors.forEach( apolloError => {
      expect( apolloError.prop( 'error' ) ).toEqual( {} );
    } );
  } );

  it( 'renders Notification with the correct initial props', async () => {
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
} );

describe( '<PackageEdit />, if data === undefined is returned', () => {
  const router = {
    push: jest.fn(),
    query: {
      id: 'test-123',
      action: 'create'
    }
  };

  const Component = (
    <MockedProvider mocks={ undefinedDataMocks }>
      <RouterContext.Provider value={ router }>
        <PackageEdit { ...props } />
      </RouterContext.Provider>
    </MockedProvider>
  );

  const consoleError = console.error;
  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders ApolloError', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const apolloError = wrapper.find( 'ApolloError' );

    expect( apolloError.exists() ).toEqual( true );
  } );
} );
