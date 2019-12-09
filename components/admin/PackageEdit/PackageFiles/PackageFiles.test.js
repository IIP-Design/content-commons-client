import { mount } from 'enzyme';
import { MockedProvider, wait } from '@apollo/react-testing';
import { errorMocks, mocks, props } from './mocks';
import PackageFiles from './PackageFiles';

jest.mock( 'next/dynamic', () => () => 'Press-Package-File' );
jest.mock(
  'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal',
  () => function EditPackageFilesModal() { return ''; }
);

const Component = (
  <MockedProvider mocks={ mocks }>
    <PackageFiles { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks }>
    <PackageFiles { ...props } />
  </MockedProvider>
);

describe( '<PackageFiles />', () => {
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
  } );

  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const pkgFiles = wrapper.find( 'PackageFiles' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading package file(s)...';

    expect( pkgFiles.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( msg ) ).toEqual( true );
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
    const pkgFiles = wrapper.find( 'PackageFiles' );

    expect( pkgFiles.exists() ).toEqual( true );
  } );

  it( 'renders the correct PressPackageFile components', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const pressPkgFiles = wrapper.find( 'Press-Package-File' );
    const { documents } = mocks[0].result.data.pkg;

    expect( pressPkgFiles.length ).toEqual( documents.length );
    pressPkgFiles.forEach( ( file, i ) => {
      expect( file.prop( 'id' ) ).toEqual( documents[i].id );
    } );
  } );

  it( 'renders the correct heading', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const pkgFiles = wrapper.find( 'PackageFiles' );
    const { documents } = mocks[0].result.data.pkg;
    const heading = `Uploaded File${documents.length > 1 ? 's' : ''}`;

    expect( pkgFiles.contains( heading ) ).toEqual( true );
  } );

  it( 'renders EditPackageFilesModal', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const editPkgFilesModal = wrapper.find( 'EditPackageFilesModal' );

    expect( editPkgFilesModal.exists() ).toEqual( true );
  } );
} );
