import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import SupportItem, { SUPPORT_ITEM_QUERY } from './SupportItem';

const props = {
  projectId: '123',
  fileType: 'srt',
  itemId: 'qwqw'
};

const mocks = [
  {
    request: {
      query: SUPPORT_ITEM_QUERY,
      variables: { id: props.itemId }
    },
    result: {
      data: {
        supportItem: {
          id: props.itemId,
          filename: 'madeinamerica_english.srt',
          filesize: '24576',
          language: {
            displayName: 'English'
          }
        }
      }
    }
  }
];

const resizeWindow = ( x, y ) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent( new Event( 'resize' ) );
};

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <SupportItem { ...props } />
  </MockedProvider>
);

describe( '<SupportItem />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const supportItem = wrapper.find( 'SupportItem' );
    const loader = <Loader active inline size="mini" />;

    expect( supportItem.exists() ).toEqual( true );
    expect( supportItem.contains( loader ) ).toEqual( true );
    expect( supportItem.find( 'span' ).text() )
      .toEqual( 'Preparing file for upload...' );
    expect( toJSON( supportItem ) ).toMatchSnapshot();
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: SUPPORT_ITEM_QUERY,
          variables: { id: props.itemId }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <SupportItem { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const li = supportItem.find( 'li.support-item.error' );
    const icon = <Icon color="red" name="exclamation triangle" size="small" as="i" />;
    const span = <span>Loading error</span>;

    expect( supportItem.exists() ).toEqual( true );
    expect( li.exists() ).toEqual( true );
    expect( supportItem.contains( icon ) ).toEqual( true );
    expect( supportItem.contains( span ) ).toEqual( true );
  } );

  it( '`componentDidMount` sets `_isMounted`', async () => {
    const wrapper = mount( Component );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();

    inst.componentDidMount();
    expect( inst._isMounted ).toEqual( true );
  } );

  it( '`componentWillUnmount` sets `_isMounted` to false', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();

    inst.componentWillUnmount();
    expect( inst._isMounted ).toEqual( false );
  } );

  it( 'renders `Progress` component if `isUploading`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = () => wrapper.find( 'SupportItem' );
    const progress = () => supportItem().find( 'Progress' );
    const isUploading = () => supportItem().state( 'isUploading' );
    const filesize = () => supportItem().prop( 'data' ).supportItem.filesize;

    expect( isUploading() ).toEqual( false );
    expect( progress().exists() ).toEqual( isUploading() );

    supportItem().setState( { isUploading: true } );

    expect( isUploading() ).toEqual( true );
    expect( progress().exists() ).toEqual( isUploading() );
    expect( progress().prop( 'total' ) ).toEqual( filesize() );
    expect( toJSON( supportItem() ) ).toMatchSnapshot();
  } );

  it( 'renders null if `supportItem` is null', async () => {
    const nullMocks = [
      {
        request: {
          query: SUPPORT_ITEM_QUERY,
          variables: { id: props.itemId }
        },
        result: { data: { supportItem: null } }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <SupportItem { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );

    expect( supportItem.html() ).toEqual( null );
  } );

  it( 'calls `debounceResize` when window is resized', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();
    const spy = jest.spyOn( inst, 'debounceResize' );

    inst.componentDidMount();

    const map = {};
    window.addEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    resizeWindow( 900, 600 );
    expect( spy ).toHaveBeenCalled();
  } );

  it( '`componentWillUnmount` removes the `resize` event listener', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();

    const map = {};
    window.removeEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    inst.componentWillUnmount();
    expect( window.removeEventListener )
      .toHaveBeenCalledWith( 'resize', inst.debounceResize );
  } );

  it( '`getShortFileName` returns an ellipsis shortened file name', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();

    const longName = 'madeinamerica_chinese_ljhlkjhl_kjhlkjh_aslkfja;lskjfweoij.srt';
    const index = 8;
    const shortName = inst
      .getShortFileName( longName, index )
      .props
      .children;

    expect( shortName ).toHaveLength( 3 );
    expect( shortName[0] ).toHaveLength( 8 );
    expect( shortName[1] ).toHaveLength( 1 );
    expect( shortName[2] ).toHaveLength( 8 );
    expect( shortName.join( '' ) ).toEqual( 'madeinam…eoij.srt' );
  } );

  it( '`getProportionalNumber` returns a number that is proportional to a reference', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();

    const reference = 500;
    const proportion = 0.625;
    const num = inst
      .getProportionalNumber( reference, proportion );
    expect( num ).toEqual( 312 );
  } );

  it( '`isLongName` returns a boolean whether given number is greater or equal to another', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();

    let itemWidth = 290;
    const reference = 500;
    const proportion = 0.625;

    const isLongName = () => (
      inst.isLongName( itemWidth, reference, proportion )
    );

    expect( isLongName() ).toEqual( false );
    itemWidth = 340;
    expect( isLongName() ).toEqual( true );
  } );

  it( '`setRefWidth` and `resetWidths` sets ref widths in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();

    const li = supportItem.find( '.support-item' );
    const span = supportItem.find( '.item-name-wrap' );
    const b = supportItem.find( '.item-lang-wrap' );

    const nodes = [li, span, b];
    const names = ['listItem', 'itemName', 'itemLang'];

    li.offsetWidth = 200;
    span.offsetWidth = 170;
    b.offsetWidth = 50;

    nodes.forEach( ( n, i ) => {
      expect( supportItem.state( `${names[i]}Width` ) )
        .toEqual( 0 );
    } );

    nodes.forEach( ( n, i ) => {
      inst.setRefWidth( n, names[i] );
      expect( supportItem.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );

    inst.resetWidths();

    nodes.forEach( ( n, i ) => {
      expect( supportItem.state( `${names[i]}Width` ) )
        .toEqual( 0 );
    } );
  } );

  it( '`resetWidths` does not reset ref widths in state if component is unmounted', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const supportItem = wrapper.find( 'SupportItem' );
    const inst = supportItem.instance();

    const li = supportItem.find( '.support-item' );
    const span = supportItem.find( '.item-name-wrap' );
    const b = supportItem.find( '.item-lang-wrap' );

    const nodes = [li, span, b];
    const names = ['listItem', 'itemName', 'itemLang'];

    li.offsetWidth = 200;
    span.offsetWidth = 170;
    b.offsetWidth = 50;

    inst.componentDidMount();
    const isMounted = () => inst._isMounted;

    expect( isMounted() ).toEqual( true );

    nodes.forEach( ( n, i ) => {
      expect( supportItem.state( `${names[i]}Width` ) )
        .toEqual( 0 );
    } );

    nodes.forEach( ( n, i ) => {
      inst.setRefWidth( n, names[i] );
      expect( supportItem.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );

    inst.componentWillUnmount();
    expect( isMounted() ).toEqual( false );

    inst.resetWidths();

    nodes.forEach( ( n, i ) => {
      expect( supportItem.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );
  } );
} );
