import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import wait from 'waait';

import PackagePreview from './PackagePreview';

import { suppressActWarning } from 'lib/utils';
import { errorMocks, mocks, undefinedDataMocks } from 'components/admin/PackageEdit/mocks';

jest.mock(
  'components/Package/Package',
  () => function Package() { return ''; },
);

const getComponent = ( data, props = { id: 'test-123' } ) => (
  <MockedProvider mocks={ data }>
    <PackagePreview { ...props } />
  </MockedProvider>
);

describe( '<PackagePreview />', () => {
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
    const msg = 'Loading the project preview...';

    expect( pkgPreview.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( pkgPreview.contains( msg ) ).toEqual( true );
  } );

  it( 'renders error message if a GraphQL error is returned', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 3 );
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

  it( 'renders Package with correct props', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const pkg = wrapper.find( 'Package' );
    const {
      createdAt, updatedAt, title, team, type, documents,
    } = mocks[0].result.data.pkg;

    const item = {
      desc: '',
      id: 'test-123',
      published: createdAt,
      modified: updatedAt,
      team,
      type,
      title,
      documents,
    };

    expect( pkg.exists() ).toEqual( true );
    expect( pkg.props() ).toEqual( {
      item,
      displayAsModal: true,
      isAdminPreview: true,
      useGraphQl: true,
    } );
  } );
} );

describe( '<PackagePreview />, if data === undefined is returned,', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  const Component = getComponent( undefinedDataMocks );

  it( 'renders ApolloError', async () => {
    const wrapper = mount( Component );

    await wait( 20 );
    wrapper.update();

    const apolloError = wrapper.find( 'ApolloError' );

    expect( apolloError.exists() ).toEqual( true );
  } );
} );
