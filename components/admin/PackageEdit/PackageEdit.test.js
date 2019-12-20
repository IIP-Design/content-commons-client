import { mount } from 'enzyme';
import { MockedProvider, wait } from '@apollo/react-testing';
import PackageEdit from './PackageEdit';
import {
  errorProps, loadingProps, mocks, noDataProps, noDocsProps, props
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

const ErrorComponent = (
  <MockedProvider mocks={ mocks }>
    <PackageEdit { ...errorProps } />
  </MockedProvider>
);

const LoadingComponent = (
  <MockedProvider mocks={ mocks }>
    <PackageEdit { ...loadingProps } />
  </MockedProvider>
);

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
  const Component = (
    <MockedProvider mocks={ mocks }>
      <PackageEdit { ...props } />
    </MockedProvider>
  );

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
    const wrapper = mount( LoadingComponent );
    const pkgEdit = wrapper.find( 'PackageEdit' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading package details page...';

    expect( pkgEdit.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( msg ) ).toEqual( true );
  } );

  it( 'renders error message if a queryError is returned', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();

    const apolloError = wrapper.find( 'ApolloError' );
    const msg = 'There was an error.';

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.contains( msg ) ).toEqual( true );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const pkgEdit = wrapper.find( 'PackageEdit' );

    expect( pkgEdit.exists() ).toEqual( true );
  } );

  it( 'renders the ProjectHeader', async () => {
    const wrapper = mount( Component );
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
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const actionButtons = wrapper.find( 'ActionButtons' );
    const btns = ['delete', 'save', 'publish'];
    const handleKeys = ['deleteConfirm', 'save', 'publish'];
    const handleFns = ['handleDeleteConfirm', 'handleExit', 'handlePublish'];

    expect( actionButtons.exists() ).toEqual( true );
    expect( actionButtons.prop( 'type' ) ).toEqual( 'package' );
    expect( typeof actionButtons.prop( 'setDeleteConfirmOpen' ) )
      .toEqual( 'function' );
    expect( actionButtons.prop( 'deleteConfirmOpen' ) ).toEqual( false );
    handleKeys.forEach( ( key, i ) => {
      expect( actionButtons.prop( 'handle' )[key].name )
        .toEqual( handleFns[i] );
    } );
    btns.forEach( btn => {
      expect( actionButtons.prop( 'disabled' )[btn] ).toEqual( false );
      expect( actionButtons.prop( 'show' )[btn] ).toEqual( true );
    } );
  } );

  it( 'clicking the Delete All button opens the Confirm modal', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const actionButtons = () => wrapper.find( 'ActionButtons' );
    const confirm = () => wrapper.find( 'Confirm' );
    const btns = actionButtons().find( 'button' );

    // closed initially
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( false );
    expect( confirm().prop( 'open' ) ).toEqual( false );

    // open the modal
    const deleteBtn = getBtn( 'Delete All', btns );
    deleteBtn.simulate( 'click' );
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( true );
    expect( confirm().prop( 'open' ) ).toEqual( true );
  } );

  it( 'clicking the Cancel button in the Confirm modal closes the modal', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const actionButtons = () => wrapper.find( 'ActionButtons' );
    const confirm = () => wrapper.find( 'Confirm' );
    const btns = actionButtons().find( 'button' );

    // closed initially
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( false );
    expect( confirm().prop( 'open' ) ).toEqual( false );

    // open the modal
    const deleteBtn = getBtn( 'Delete All', btns );
    deleteBtn.simulate( 'click' );
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( true );
    expect( confirm().prop( 'open' ) ).toEqual( true );

    // cancel delete and close modal
    const cancelBtn = getBtn( 'No, take me back', confirm().find( 'button' ) );
    cancelBtn.simulate( 'click' );
    expect( actionButtons().prop( 'deleteConfirmOpen' ) ).toEqual( false );
    expect( confirm().prop( 'open' ) ).toEqual( false );
  } );

  it( 'ActionButtons handle.deleteConfirm calls deletePackage and redirects to the dashboard', async done => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const actionButtons = () => wrapper.find( 'ActionButtons' );
    const { deleteConfirm } = actionButtons().prop( 'handle' );

    const test = async () => {
      await deleteConfirm();

      /**
       * redirect behavior test is also evidence that `deletePackage`
       * was called since a redirect does not occur unless
       * the `deletedPackageId` is returned from `deletePackage`
       */
      expect( props.router.push )
        .toHaveBeenCalledWith( { pathname: '/admin/dashboard' } );
      done();
    };
    test();
  } );

  it( 'clicking the Save & Exit button redirects to the dashboard', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const actionButtons = () => wrapper.find( 'ActionButtons' );
    const btns = actionButtons().find( 'button' );
    const saveBtn = getBtn( 'Save & Exit', btns );

    saveBtn.simulate( 'click' );
    expect( props.router.push ).toHaveBeenCalledWith( {
      pathname: '/admin/dashboard'
    } );
  } );

  it( 'clicking the Publish button ... TBD', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const actionButtons = () => wrapper.find( 'ActionButtons' );
    const btns = actionButtons().find( 'button' );
    const publishBtn = getBtn( 'Publish', btns );
    const spy = jest.spyOn( global.console, 'log' );

    publishBtn.simulate( 'click' );
    /**
     * Will need to revisit once publishing capability is added.
     * For now, check to see if `console.log` was called.
     */
    expect( spy ).toHaveBeenCalledWith( 'Publish' );
  } );

  it( 'renders the PackageDetailsFormContainer', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const pkgFormContainer = wrapper.find( 'PackageDetailsFormContainer' );

    expect( pkgFormContainer.exists() ).toEqual( true );
    expect( pkgFormContainer.prop( 'id' ) ).toEqual( props.router.query.id );
    expect( pkgFormContainer.prop( 'updateNotification' ).name )
      .toEqual( 'updateNotification' );
    expect( pkgFormContainer.prop( 'hasUploadCompleted' ) )
      .toEqual( !!props.data.pkg.documents.length );
  } );

  it( 'renders ActionHeadline', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const actionHeadline = wrapper.find( 'ActionHeadline' );
    const { pkg } = props.data;
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
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const buttonPublish = wrapper.find( 'ButtonPublish' );
    const { pkg } = props.data;

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

  it( 'ButtonPublish handlePublish calls handlePublish ... TBD', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const buttonPublish = wrapper.find( 'ButtonPublish' );
    const spy = jest.spyOn( global.console, 'log' );

    buttonPublish.prop( 'handlePublish' )();
    /**
     * Will need to revisit once publishing capability is added.
     * For now, check to see if `console.log` was called.
     */
    expect( spy ).toHaveBeenCalledWith( 'Publish' );
  } );

  it( 'ButtonPublish handleUnPublish calls handleUnPublish ... TBD', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const buttonPublish = wrapper.find( 'ButtonPublish' );
    const spy = jest.spyOn( global.console, 'log' );

    buttonPublish.prop( 'handleUnPublish' )();
    /**
     * Will need to revisit once unpublishing capability is added.
     * For now, check to see if `console.log` was called.
     */
    expect( spy ).toHaveBeenCalledWith( 'Unpublish' );
  } );

  it( 'renders ApolloError with an empty error prop', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const apolloError = wrapper.find( 'ApolloError' );

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.prop( 'error' ) ).toEqual( {} );
  } );

  it( 'renders Notification with the correct initial props', async () => {
    const wrapper = mount( Component );
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
  const Component = (
    <MockedProvider mocks={ mocks }>
      <PackageEdit { ...noDocsProps } />
    </MockedProvider>
  );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( LoadingComponent );
    const pkgEdit = wrapper.find( 'PackageEdit' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading package details page...';

    expect( pkgEdit.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( msg ) ).toEqual( true );
  } );

  it( 'renders error message if a queryError is returned', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();

    const apolloError = wrapper.find( 'ApolloError' );
    const msg = 'There was an error.';

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.contains( msg ) ).toEqual( true );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const pkgEdit = wrapper.find( 'PackageEdit' );

    expect( pkgEdit.exists() ).toEqual( true );
  } );

  it( 'renders the ProjectHeader', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const projectHeader = wrapper.find( 'ProjectHeader' );
    const icon = wrapper.find( 'Icon[name="file"]' );
    const title = 'Package Details';

    expect( projectHeader.exists() ).toEqual( true );
    expect( icon.exists() ).toEqual( true );
    expect( projectHeader.contains( title ) ).toEqual( true );
  } );

  it( 'does not display the action buttons', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const actionButtons = wrapper.find( 'ActionButtons' );
    const btns = ['delete', 'save', 'publish'];

    btns.forEach( btn => {
      expect( actionButtons.prop( 'show' )[btn] ).toEqual( false );
    } );
  } );

  it( 'does not render PackageActions', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const pkgActions = wrapper.find( 'PackageActions' );

    expect( pkgActions.exists() ).toEqual( false );
  } );

  it( 'renders the PackageDetailsFormContainer', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const pkgFormContainer = wrapper.find( 'PackageDetailsFormContainer' );

    expect( pkgFormContainer.exists() ).toEqual( true );
    expect( pkgFormContainer.prop( 'id' ) ).toEqual( props.router.query.id );
    expect( pkgFormContainer.prop( 'updateNotification' ).name )
      .toEqual( 'updateNotification' );
    expect( pkgFormContainer.prop( 'hasUploadCompleted' ) )
      .toEqual( !!noDocsProps.data.pkg.documents.length );
  } );

  it( 'renders ApolloError with an empty error prop', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const apolloError = wrapper.find( 'ApolloError' );

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.prop( 'error' ) ).toEqual( {} );
  } );

  it( 'renders Notification with the correct initial props', async () => {
    const wrapper = mount( Component );
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
  const Component = (
    <MockedProvider mocks={ mocks }>
      <PackageEdit { ...noDataProps } />
    </MockedProvider>
  );

  it( 'returns null and does not crash', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const pkgEdit = wrapper.find( 'PackageEdit' );

    expect( pkgEdit.html() ).toEqual( null );
  } );
} );
