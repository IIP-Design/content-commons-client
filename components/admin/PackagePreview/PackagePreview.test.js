import { mount } from 'enzyme';
import { MockedProvider, wait } from '@apollo/react-testing';
import moment from 'moment';
import {
  errorMocks, mocks, noDocumentsMocks, undefinedDataMocks
} from 'components/admin/PackageEdit/mocks';
import PackagePreview from './PackagePreview';

jest.mock(
  'components/Share/Share',
  () => function Share() { return ''; }
);
jest.mock(
  'components/popups/PopupTabbed',
  () => function PopupTabbed() { return ''; }
);
jest.mock(
  'components/admin/download/DownloadPkgFiles/DownloadPkgFiles',
  () => function DownloadPkgFiles() { return ''; }
);
jest.mock(
  'components/admin/PackagePreview/PackageItemPreview/PackageItemPreview',
  () => function PackageItemPreview() { return ''; }
);

const getComponent = ( data, props = { id: 'test-123' } ) => (
  <MockedProvider mocks={ data }>
    <PackagePreview { ...props } />
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

const getPopupTrigger = ( str, triggers ) => (
  triggers.findWhere( n => n.prop( 'tooltip' ) === str )
);

describe( '<PackagePreview />', () => {
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

  const Component = getComponent( mocks );
  const ErrorComponent = getComponent( errorMocks );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const pkgPreview = wrapper.find( 'PackagePreview' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading the package preview...';

    expect( pkgPreview.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( pkgPreview.contains( msg ) ).toEqual( true );
  } );

  it( 'renders error message if a GraphQL error is returned', async () => {
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
    const pkgPreview = wrapper.find( 'PackagePreview' );

    expect( pkgPreview.exists() ).toEqual( true );
  } );

  it( 'renders ModalItem with the correct prop values', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const modalItem = wrapper.find( 'ModalItem' );

    expect( modalItem.prop( 'className' ) ).toEqual( 'package-preview' );
    expect( modalItem.prop( 'headline' ) )
      .toEqual( mocks[0].result.data.pkg.title );
    expect( modalItem.prop( 'textDirection' ) ).toEqual( 'LTR' );
  } );

  it( 'renders Notification with the correct prop values', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const notification = wrapper.find( 'Notification' );
    const msg = 'This is a preview of your package on Content Commons.';
    const styles = {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      padding: '1em 1.5em',
      fontSize: '1em',
      backgroundColor: '#fdb81e'
    };

    expect( notification.exists() ).toEqual( true );
    expect( notification.prop( 'el' ) ).toEqual( 'p' );
    expect( notification.prop( 'show' ) ).toEqual( true );
    expect( notification.prop( 'customStyles' ) ).toEqual( styles );
    expect( notification.prop( 'msg' ) ).toEqual( msg );
  } );

  it( 'renders "Share package" PopupTrigger', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const triggers = wrapper.find( 'PopupTrigger' );
    const shareTrigger = getPopupTrigger( 'Share package', triggers );
    const content = mount( shareTrigger.prop( 'content' ) );
    const share = content.find( 'Share' );

    expect( shareTrigger.exists() ).toEqual( true );
    expect( content.name() ).toEqual( 'Popup' );
    expect( content.prop( 'title' ) ).toEqual( 'Share this package.' );
    expect( share.exists() ).toEqual( true );
    expect( share.props() ).toEqual( {
      id: 'test-123',
      isPreview: true,
      language: 'en-us',
      link: 'The direct link to the package will appear here.',
      site: '',
      title: mocks[0].result.data.pkg.title,
      type: 'package'
    } );
  } );

  it( 'renders "Download files" PopupTrigger', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const triggers = wrapper.find( 'PopupTrigger' );
    const downloadTrigger = getPopupTrigger( 'Download files', triggers );
    const content = mount( downloadTrigger.prop( 'content' ) );
    const panes = [
      { title: 'Documents', componentName: 'DownloadPkgFiles' }
    ];

    expect( downloadTrigger.exists() ).toEqual( true );
    expect( content.name() ).toEqual( 'PopupTabbed' );
    expect( content.prop( 'title' ) ).toEqual( 'Package Files' );
    content.prop( 'panes' ).forEach( ( pane, i ) => {
      const { title, component: { type: { name } } } = pane;
      expect( title ).toEqual( panes[i].title );
      expect( name ).toEqual( panes[i].componentName );
    } );
  } );

  it( 'renders correct date & time if pkg has been updated', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const dateTime = wrapper.find( '.package-preview > .date-time' );
    const dt = dateTime.find( 'dt' );
    const dd = dateTime.find( 'dd' );
    const time = dd.find( 'time' );
    const { createdAt, updatedAt } = mocks[0].result.data.pkg;
    const isUpdated = updatedAt > createdAt;
    const label = isUpdated ? 'Updated' : 'Created';
    const stamp = isUpdated ? updatedAt : createdAt;

    expect( dateTime.exists() ).toEqual( true );
    expect( dt.text() ).toEqual( label );
    expect( dt.prop( 'id' ) ).toEqual( `${label}-test-123` );
    expect( dd.prop( 'role' ) ).toEqual( 'definition' );
    expect( dd.prop( 'aria-labelledby' ) ).toEqual( dt.prop( 'id' ) );
    expect( time.prop( 'dateTime' ) ).toEqual( stamp );
    expect( time.text() ).toEqual( moment( stamp ).format( 'LT, l' ) );
  } );

  it( 'renders correct date & time if pkg has NOT been updated', async () => {
    // get new component with different package id
    const NewComponent = getComponent( mocks, { id: 'new-pkg-id-xyz' } );
    const wrapper = mount( NewComponent );
    await wait( 0 );
    wrapper.update();

    const dateTime = wrapper.find( '.package-preview > .date-time' );
    const dt = dateTime.find( 'dt' );
    const dd = dateTime.find( 'dd' );
    const time = dd.find( 'time' );
    const { createdAt, updatedAt } = mocks[2].result.data.pkg;
    const isUpdated = updatedAt > createdAt;
    const label = isUpdated ? 'Updated' : 'Created';
    const stamp = isUpdated ? updatedAt : createdAt;

    expect( dateTime.exists() ).toEqual( true );
    expect( dt.text() ).toEqual( label );
    expect( dt.prop( 'id' ) ).toEqual( `${label}-new-pkg-id-xyz` );
    expect( dd.prop( 'role' ) ).toEqual( 'definition' );
    expect( dd.prop( 'aria-labelledby' ) ).toEqual( dt.prop( 'id' ) );
    expect( time.prop( 'dateTime' ) ).toEqual( stamp );
    expect( time.text() ).toEqual( moment( stamp ).format( 'LT, l' ) );
  } );

  it( 'renders the correct file count', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const fileCount = wrapper.find( '.file-count' );
    const count = mocks[0].result.data.pkg.documents.length;
    const msg = `(${count}) documents in this package`;

    expect( fileCount.text() ).toEqual( msg );
  } );

  it( 'renders PackageItemPreview for each file', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const packageItems = wrapper.find( '.package-items' );
    const packageItemPreviews = packageItems.find( 'PackageItemPreview' );
    const { team, type, documents } = mocks[0].result.data.pkg;

    expect( packageItems.exists() ).toEqual( true );
    expect( packageItemPreviews.length ).toEqual( documents.length );
    packageItemPreviews.forEach( ( p, i ) => {
      const propValues = {
        file: documents[i],
        team,
        type
      };
      expect( p.props() ).toEqual( propValues );
    } );
  } );
} );

describe( '<PackageEdit />, if there are no documents,', () => {
  const consoleError = console.error;
  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  const Component = getComponent( noDocumentsMocks );

  it( 'renders the No Files message', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const packageItems = wrapper.find( '.package-items' );
    const packageItemPreviews = packageItems.find( 'PackageItemPreview' );
    const msg = 'There are no files associated with this package.';

    expect( packageItems.exists() ).toEqual( true );
    expect( packageItemPreviews.exists() ).toEqual( false );
    expect( packageItems.contains( msg ) ).toEqual( true );
  } );
} );

describe( '<PackageEdit />, if data === undefined is returned,', () => {
  const consoleError = console.error;
  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  const Component = getComponent( undefinedDataMocks );

  it( 'renders ApolloError', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const apolloError = wrapper.find( 'ApolloError' );

    expect( apolloError.exists() ).toEqual( true );
  } );
} );
