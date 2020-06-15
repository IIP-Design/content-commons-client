import { mount } from 'enzyme';
import PackagePageIndex from '../../pages/admin/package';

const props = {
  query: { id: 'ck181818' },
  router: { push: jest.fn() },
};

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

const Component = <PackagePageIndex { ...props } />;

describe( '<PackagePageIndex />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'redirects to the dashboard if there is no id', () => {
    const wrapper = mount( Component );

    wrapper.setProps( { query: {} } );

    expect( props.router.push ).toHaveBeenCalledWith( '/admin/dashboard' );
  } );

  it( 'getInitialProps does not call res.writeHead and res.end if a query.id exists', async done => {
    const wrapper = mount( Component );
    const args = {
      query: props.query,
      res: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
    };

    const ret = await PackagePageIndex.getInitialProps( args );

    expect( wrapper.prop( 'query' ).id ).toEqual( props.query.id );
    expect( ret ).toEqual( {} );
    expect( args.res.writeHead ).not.toHaveBeenCalled();
    expect( args.res.end ).not.toHaveBeenCalled();
    done();
  } );

  it( 'getInitialProps calls res.writeHead and res.end if a !query.id', async done => {
    const wrapper = mount( Component );

    wrapper.setProps( { query: {} } );

    const args = {
      query: wrapper.prop( 'query' ),
      res: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
    };

    const ret = await PackagePageIndex.getInitialProps( args );

    expect( wrapper.prop( 'query' ).id ).toEqual( undefined );
    expect( ret ).toEqual( {} );
    expect( args.res.writeHead ).toHaveBeenCalledWith( 302, {
      Location: '/admin/dashboard',
    } );
    expect( args.res.end ).toHaveBeenCalled();
    done();
  } );
} );
