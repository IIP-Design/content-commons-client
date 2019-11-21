import { mount } from 'enzyme';
import mockAxios from 'axios';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import { UploadContext } from '../../ProjectEdit/VideoEdit/UploadContext';
import {
  emptyItemProps,
  emptyMocks,
  errorMocks,
  longFileNameProps,
  mocks,
  nullItemProps,
  nullMocks,
  postUploadProps,
  preUploadProps,
  props,
  uploadErrorProps
} from './mocks';
import SupportItem from './SupportItem';

jest.mock( 'next-server/dynamic', () => () => 'Dynamic' );
jest.mock( 'next-server/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <UploadContext.Provider value>
      <SupportItem { ...props } />
    </UploadContext.Provider>
  </MockedProvider>
);

const PreUploadComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <UploadContext.Provider value>
      <SupportItem { ...preUploadProps } />
    </UploadContext.Provider>
  </MockedProvider>
);

const LongFileNameComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <UploadContext.Provider value>
      <SupportItem { ...longFileNameProps } />
    </UploadContext.Provider>
  </MockedProvider>
);

const UploadErrorComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <UploadContext.Provider value>
      <SupportItem { ...uploadErrorProps } />
    </UploadContext.Provider>
  </MockedProvider>
);

const PostUploadComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <UploadContext.Provider value={ false }>
      <SupportItem { ...postUploadProps } />
    </UploadContext.Provider>
  </MockedProvider>
);

const ErrorMocksComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <UploadContext.Provider value={ false }>
      <SupportItem { ...props } />
    </UploadContext.Provider>
  </MockedProvider>
);

const EmptyMocksComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <UploadContext.Provider value={ false }>
      <SupportItem { ...props } />
    </UploadContext.Provider>
  </MockedProvider>
);

const NullMocksComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <UploadContext.Provider value={ false }>
      <SupportItem { ...props } />
    </UploadContext.Provider>
  </MockedProvider>
);

const EmptyItemComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <UploadContext.Provider value={ false }>
      <SupportItem { ...emptyItemProps } />
    </UploadContext.Provider>
  </MockedProvider>
);

const NullItemComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <UploadContext.Provider value={ false }>
      <SupportItem { ...nullItemProps } />
    </UploadContext.Provider>
  </MockedProvider>
);

describe( '<SupportItem />', () => {
  // store console.dir & mock its call in axios.catch
  const consoleDir = console.dir;

  /**
   * @todo Suppress React 16.8 `act()` warnings globally.
   * The React team's fix won't be out of alpha until 16.9.0.
   * @see https://github.com/facebook/react/issues/14769
   */
  const consoleError = console.error;
  beforeAll( () => {
    const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';
    jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
      if ( !args[0].includes( actMsg ) ) {
        consoleError( ...args );
      }
    } );

    const resp = { status: 200 };
    mockAxios.get = jest.fn();
    mockAxios.get.mockResolvedValue( resp );

    console.dir = jest.fn();
  } );

  afterAll( () => {
    // restore console.error and console.dir
    console.error = consoleError;
    console.dir = consoleDir;
  } );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const supportItem = wrapper.find( 'SupportItem' );

    expect( supportItem.exists() ).toEqual( true );
  } );

  it( 'renders an active Loader if uploading is in progress', async () => {
    const wrapper = mount( PreUploadComponent );
    await wait( 0 );
    wrapper.update();
    const loader = wrapper.find( 'Loader' );

    expect( loader.prop( 'active' ) ).toEqual( true );
  } );

  it( 'renders an inactive Loader if uploading is complete', async () => {
    const wrapper = mount( PostUploadComponent );
    await wait( 0 );
    wrapper.update();
    const loader = wrapper.find( 'Loader' );

    expect( loader.prop( 'active' ) ).toEqual( false );
  } );

  it( 'does not crash if server returns a GraphQL error', async () => {
    const wrapper = mount( ErrorMocksComponent );
    await wait( 0 );
    wrapper.update();
    const supportItem = wrapper.find( 'SupportItem' );
    const apolloError = supportItem.find( 'ApolloError' );
    const { error } = supportItem.prop( 'data' );

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.prop( 'error' ) ).toEqual( error );
  } );

  it( 'does not crash if languages is []', async () => {
    const wrapper = mount( EmptyMocksComponent );
    await wait( 0 );
    wrapper.update();
    const itemName = wrapper.find( '.item-name' );
    const itemLang = wrapper.find( '.item-lang' );
    const { filename, language } = props.item;

    expect( itemName.exists() ).toEqual( true );
    expect( itemName.contains( filename ) ).toEqual( true );
    expect( itemLang.exists() ).toEqual( true );
    expect( itemLang.contains( language.displayName ) ).toEqual( true );
  } );

  it( 'does not crash if languages is null', async () => {
    const wrapper = mount( NullMocksComponent );
    await wait( 0 );
    wrapper.update();
    const itemName = wrapper.find( '.item-name' );
    const itemLang = wrapper.find( '.item-lang' );
    const { filename, language } = props.item;

    expect( itemName.exists() ).toEqual( true );
    expect( itemName.contains( filename ) ).toEqual( true );
    expect( itemLang.exists() ).toEqual( true );
    expect( itemLang.contains( language.displayName ) ).toEqual( true );
  } );

  it( 'does not crash and renders null if props.item is {}', async () => {
    const wrapper = mount( EmptyItemComponent );
    await wait( 0 );
    wrapper.update();
    const supportItem = wrapper.find( 'SupportItem' );

    expect( supportItem.html() ).toEqual( null );
  } );

  it.skip( 'does not crash and renders null if props.item is null', async () => {
    const wrapper = mount( NullItemComponent );
    await wait( 0 );
    wrapper.update();
    const supportItem = wrapper.find( 'SupportItem' );

    expect( supportItem.html() ).toEqual( null );
  } );

  it( 'renders GeneralError and no language if an axios error occurs (pre-upload)', async () => {
    const wrapper = mount( UploadErrorComponent );
    await wait( 0 );
    wrapper.update();
    const supportItem = wrapper.find( 'SupportItem' );
    const generalError = supportItem.find( 'GeneralError' );
    const icon = supportItem.find( '.icon > img[alt="alert icon"]' );
    const langEl = supportItem.find( 'span.item-lang.error' );
    const { name: filename } = uploadErrorProps.item.input;

    const err = { isAxiosError: true };
    mockAxios.get.mockRejectedValue( err );

    expect( generalError.exists() ).toEqual( true );
    expect( generalError.contains( filename ) ).toEqual( true );
    expect( icon.exists() ).toEqual( true );
    expect( langEl.exists() ).toEqual( true );
    expect( langEl.children().length ).toEqual( 0 );
  } );

  it( 'renders GeneralError and no language if an axios error occurs (post-upload)', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const supportItem = wrapper.find( 'SupportItem' );
    const generalError = supportItem.find( 'GeneralError' );
    const icon = supportItem.find( '.icon > img[alt="alert icon"]' );
    const langEl = supportItem.find( 'span.item-lang.error' );
    const { name: filename } = uploadErrorProps.item.input;

    // mock axios rejected value to enter .catch block
    const err = { isAxiosError: true };
    mockAxios.get.mockRejectedValue( err );

    expect( console.dir ).toHaveBeenCalledWith( err );
    expect( generalError.exists() ).toEqual( true );
    expect( generalError.contains( filename ) ).toEqual( true );
    expect( icon.exists() ).toEqual( true );
    expect( langEl.exists() ).toEqual( true );
    expect( langEl.children().length ).toEqual( 0 );
  } );

  it( 'renders a truncated file name if filename is over 45 characters', async () => {
    const wrapper = mount( LongFileNameComponent );
    await wait( 0 );
    wrapper.update();

    const visuallyHidden = wrapper.find( 'VisuallyHidden' );
    const itemNameWrap = wrapper.find( 'span.item-name-wrap' );
    const popup = itemNameWrap.find( 'Popup' );
    const focusable = popup.find( 'Focusable' );
    const { filename } = longFileNameProps.item;

    expect( visuallyHidden.exists() ).toEqual( true );
    expect( visuallyHidden.contains( filename ) ).toEqual( true );
    expect( popup.exists() ).toEqual( true );
    expect( popup.prop( 'content' ) ).toEqual( filename );
    expect( focusable.exists() ).toEqual( true );

    // larger screens
    const windowOuterWidth = window.outerWidth;
    window.outerWidth = 1000;
    const shortname = isWindowWidthLessThanOrEqualTo( 900 )
      ? 'image-image-...-image-1.png'
      : 'image-image-imag...mage-image-1.png';

    expect( window.outerWidth ).toEqual( 1000 );
    expect( focusable.contains( shortname ) ).toEqual( true );

    // smaller screens
    window.outerWidth = 800;
    expect( window.outerWidth ).toEqual( 800 );
    expect( focusable.contains( shortname ) ).toEqual( true );

    // restore default
    window.outWidth = windowOuterWidth;
  } );
} );
