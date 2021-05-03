import { mount } from 'enzyme';
import Header from './Header';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

jest.mock(
  'components/SearchInput/SearchInput',
  () => function SearchInput() { return ''; },
);

jest.mock(
  '../navs/global',
  () => function GlobalNav() { return ''; },
);

describe( '<Header />', () => {
  let Component;
  let wrapper;
  let headerGlobal;

  const props = {
    router: {
      pathname: '/',
    },
  };

  beforeEach( () => {
    Component = <Header { ...props } />;
    wrapper = mount( Component );
    headerGlobal = wrapper.find( 'HeaderGlobal' );
  } );

  it( 'renders without crashing', () => {
    expect( headerGlobal.exists() ).toEqual( true );
  } );

  it( 'renders the correct barClass value for the home page', () => {
    const homeWrapper = headerGlobal.find( '.bar.bar--home' );

    expect( homeWrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct barClass value for a non-home page', () => {
    wrapper.setProps( {
      router: {
        pathname: '/results',
      },
    } );
    const resultsWrapper = wrapper.find( '.bar.bar--results' );

    expect( resultsWrapper.exists() ).toEqual( true );
  } );

  it( 'renders a header with banner role', () => {
    const header = headerGlobal.find( 'header[role="banner"]' );

    expect( header.exists() ).toEqual( true );
  } );

  it( 'renders the correct DoS seal dimensions', () => {
    const img = headerGlobal.find( 'img' );

    expect( img.prop( 'height' ) ).toEqual( 60 );
    expect( img.prop( 'width' ) ).toEqual( 60 );
  } );

  it( 'renders the search form', () => {
    const search = headerGlobal.find( 'SearchInput' );

    expect( search.exists() ).toEqual( true );
  } );

  it( 'renders the global nav', () => {
    const globalNav = headerGlobal.find( 'GlobalNav' );

    expect( globalNav.exists() ).toEqual( true );
  } );
} );
