import { mount } from 'enzyme';
import { tag1, tag2, mocks as pkgFiles } from 'components/admin/PackageEdit/PackageFiles/mocks';
import { pressJournalism } from 'components/admin/PackageEdit/mocks';
import PackagePage from './[id]';

jest.mock( 'next/dynamic', () => () => 'dynamic' );
jest.mock(
  'components/admin/PackageEdit/PackageEdit',
  () => function PackageEdit() { return ''; }
);

const { documents } = pkgFiles[0].result.data.pkg;

const props = {
  query: { id: 'ck181818' },
  router: {
    push: jest.fn(),
    query: { id: 'ck181818' }
  },
  data: {
    pkg: {
      __typename: 'Package',
      id: 'ck181818',
      createdAt: '2019-11-12T13:07:49.364Z',
      updatedAt: '2019-11-12T13:08:28.830Z',
      publishedAt: '',
      type: 'DAILY_GUIDANCE',
      assetPath: '',
      author: {
        __typename: 'User',
        id: 'ck2m042xo0rnp0720nb4gxjix',
        firstName: 'First',
        lastName: 'Last'
      },
      team: {
        __typename: 'Team',
        id: 'ck2qgfbku0ubh0720iwhkvuyn',
        name: 'GPA Press Office'
      },
      title: 'Final Guidance mm-dd-yy',
      desc: '',
      status: 'DRAFT',
      visibility: 'INTERNAL',
      categories: [pressJournalism],
      tags: [tag1, tag2],
      documents
    }
  }
};

const noIdProps = {
  query: {},
  router: {
    push: jest.fn(),
    query: {}
  }
};

const Component = <PackagePage { ...props } />;
const NoIdComponent = <PackagePage { ...noIdProps } />;

describe( '<PackagePage />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the PackageEdit component', () => {
    const wrapper = mount( Component );
    const packageEdit = wrapper.find( 'PackageEdit' );

    expect( packageEdit.exists() ).toEqual( true );
  } );

  it( 'passes the correct SSR data to PackageEdit', () => {
    const wrapper = mount( Component );
    const packageEdit = wrapper.find( 'PackageEdit' );

    expect( packageEdit.prop( 'data' ) ).toEqual( props.data );
  } );

  it( 'getInitialProps returns {} if !query.id', async () => {
    const wrapper = mount( NoIdComponent );
    const packageEdit = wrapper.find( 'PackageEdit' );
    const args = { query: noIdProps.query };
    const ret = await PackagePage.getInitialProps( args );

    expect( packageEdit.prop( 'data' ) ).toEqual( undefined );
    expect( ret ).toEqual( {} );
  } );
} );
