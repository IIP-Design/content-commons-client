import { mount } from 'enzyme';
import { MockedProvider, wait } from '@apollo/react-testing';
import PackagePreview from './PackagePreview';
import {
  errorMocks, mocks, undefinedDataMocks
} from '../mocks';

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
      borderTopLeftRadius: '0.28571429rem',
      borderTopRightRadius: '0.28571429rem',
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
      { title: 'Documents', componentName: 'DownloadPkgFiles' },
      { title: 'Help', componentName: 'DownloadHelp' }
    ];

    expect( downloadTrigger.exists() ).toEqual( true );
    expect( content.name() ).toEqual( 'PopupTabbed' );
    expect( content.prop( 'title' ) ).toEqual( 'Download this document.' );
    content.prop( 'panes' ).forEach( ( pane, i ) => {
      const { title, component: { type: { name } } } = pane;
      expect( title ).toEqual( panes[i].title );
      expect( name ).toEqual( panes[i].componentName );
    } );
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
