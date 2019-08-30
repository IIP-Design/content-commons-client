import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Icon, Loader } from 'semantic-ui-react';
import { projects, supportFilesConfig } from 'components/admin/ProjectEdit/mockData';
import SupportItem from './SupportItem';

const props = {
  supportItem: projects[0].supportFiles.srt[0],
  projectId: { videoID: 'made-in-america' },
  fileType: supportFilesConfig.srt.fileType,
  itemId: projects[0].supportFiles.srt[0].id
};

const resizeWindow = ( x, y ) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent( new Event( 'resize' ) );
};

const Component = <SupportItem { ...props } />;

describe( '<SupportItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( '`componentDidMount` sets `_isMounted`', () => {
    const wrapper = shallow( Component );
    wrapper.instance().componentDidMount();
    expect( wrapper.instance()._isMounted ).toEqual( true );
  } );

  it( '`componentWillUnmount` sets `_isMounted` to false', () => {
    const wrapper = shallow( Component );
    wrapper.instance().componentWillUnmount();
    expect( wrapper.instance()._isMounted ).toEqual( false );
  } );

  it( 'renders `Progress` component if `isUploading`', () => {
    const wrapper = shallow( Component );
    const progress = () => wrapper.find( 'Progress' );
    const isUploading = () => wrapper.state( 'isUploading' );

    expect( isUploading() ).toEqual( false );
    expect( progress().exists() ).toEqual( isUploading() );

    wrapper.setState( { isUploading: true } );
    expect( progress().exists() ).toEqual( isUploading() );
    expect( progress().prop( 'total' ) )
      .toEqual( props.supportItem.size.filesize );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders null if `supportItem` is empty', () => {
    const wrapper = shallow( Component );

    wrapper.setState( { supportItem: {} } );
    expect( wrapper.state( 'supportItem' ) ).toEqual( {} );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders null if there is no `supportItem`', () => {
    const wrapper = shallow( Component );

    wrapper.setState( { supportItem: null } );
    expect( wrapper.state( 'supportItem' ) ).toEqual( null );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders an uploading message and `Loader` if `supportItem` is loading', () => {
    const wrapper = shallow( Component );

    wrapper.setState( {
      supportItem: {
        id: '5678',
        lang: 'Arabic',
        file: 'madeinamerica_arabic.srt',
        uploadStatus: {
          error: false,
          success: false
        },
        size: {
          filesize: 24576
        },
        loading: true
      }
    } );

    expect( wrapper.state( 'supportItem' ).loading )
      .toEqual( true );
    expect( wrapper.contains( <Loader active inline size="mini" /> ) )
      .toEqual( true );
    expect( wrapper.find( 'span' ).text() )
      .toEqual( 'Preparing file for upload...' );
  } );

  it( 'renders error icon and message if `supportItem` has an error `uploadStatus`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'li.support-item.error' ).exists() )
      .toEqual( false );

    wrapper.setState( {
      supportItem: {
        id: '5678',
        lang: 'Arabic',
        file: 'madeinamerica_arabic.srt',
        uploadStatus: {
          error: true,
          success: false
        },
        size: { filesize: 24576 }
      }
    } );

    expect( wrapper.state( 'supportItem' ).uploadStatus.error )
      .toEqual( true );
    expect( wrapper.find( 'li.support-item.error' ).exists() )
      .toEqual( true );
    expect( wrapper.contains( <Icon color="red" name="exclamation triangle" size="small" as="i" /> ) )
      .toEqual( true );
    expect( wrapper.find( 'span' ).text() )
      .toEqual( 'Uploading error' );
  } );

  it( 'renders error icon and message if `supportItem` has an error', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'li.support-item.error' ).exists() )
      .toEqual( false );

    wrapper.setState( {
      supportItem: {
        id: '5678',
        lang: 'Arabic',
        file: 'madeinamerica_arabic.srt',
        uploadStatus: {
          error: false,
          success: false
        },
        size: { filesize: 24576 },
        error: true
      }
    } );

    expect( wrapper.state( 'supportItem' ).error )
      .toEqual( true );
    expect( wrapper.find( 'li.support-item.error' ).exists() )
      .toEqual( true );
    expect( wrapper.contains( <Icon color="red" name="exclamation triangle" size="small" as="i" /> ) )
      .toEqual( true );
    expect( wrapper.find( 'span' ).text() )
      .toEqual( 'Loading error' );
  } );

  it( 'calls `debounceResize` when window is resized', () => {
    const wrapper = shallow( Component );
    const spy = jest.spyOn( wrapper.instance(), 'debounceResize' );

    wrapper.instance().componentDidMount();

    const map = {};
    window.addEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    resizeWindow( 900, 600 );
    expect( spy ).toHaveBeenCalled();
  } );

  it( '`componentWillUnmount` removes the `resize` event listener', () => {
    const wrapper = shallow( Component );
    const map = {};
    window.removeEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    wrapper.instance().componentWillUnmount();
    expect( window.removeEventListener ).toHaveBeenCalledWith( 'resize', wrapper.instance().debounceResize );
  } );

  it( '`getShortFileName` returns an ellipsis shortened file name', () => {
    const wrapper = shallow( Component );
    const longName = 'madeinamerica_chinese_ljhlkjhl_kjhlkjh_aslkfja;lskjfweoij.srt';
    const index = 8;
    const shortName = wrapper.instance()
      .getShortFileName( longName, index )
      .props
      .children;

    expect( shortName ).toHaveLength( 3 );
    expect( shortName[0] ).toHaveLength( 8 );
    expect( shortName[1] ).toHaveLength( 1 );
    expect( shortName[2] ).toHaveLength( 8 );
    expect( shortName.join( '' ) ).toEqual( 'madeinam…eoij.srt' );
  } );

  it( '`getProportionalNumber` returns a number that is proportional to a reference', () => {
    const wrapper = shallow( Component );
    const reference = 500;
    const proportion = 0.625;
    const num = wrapper.instance()
      .getProportionalNumber( reference, proportion );
    expect( num ).toEqual( 312 );
  } );

  it( '`isLongName` returns a boolean whether given number is greater or equal to another', () => {
    const wrapper = shallow( Component );
    let itemWidth = 290;
    const reference = 500;
    const proportion = 0.625;

    const isLongName = () => (
      wrapper.instance()
        .isLongName( itemWidth, reference, proportion )
    );

    expect( isLongName() ).toEqual( false );
    itemWidth = 340;
    expect( isLongName() ).toEqual( true );
  } );

  it( '`setRefWidth` and `resetWidths` sets ref widths in state', () => {
    const wrapper = shallow( Component );
    const li = wrapper.find( '.support-item' );
    const span = wrapper.find( '.item-name-wrap' );
    const b = wrapper.find( '.item-lang-wrap' );

    const nodes = [li, span, b];
    const names = ['listItem', 'itemName', 'itemLang'];

    li.offsetWidth = 200;
    span.offsetWidth = 170;
    b.offsetWidth = 50;

    nodes.forEach( ( n, i ) => {
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( null );
    } );

    nodes.forEach( ( n, i ) => {
      wrapper.instance().setRefWidth( n, names[i] );
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );

    wrapper.instance().resetWidths();

    nodes.forEach( ( n, i ) => {
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( null );
    } );
  } );

  it( '`resetWidths` does not reset ref widths in state if component is unmounted', () => {
    const wrapper = shallow( Component );
    const li = wrapper.find( '.support-item' );
    const span = wrapper.find( '.item-name-wrap' );
    const b = wrapper.find( '.item-lang-wrap' );

    const nodes = [li, span, b];
    const names = ['listItem', 'itemName', 'itemLang'];

    li.offsetWidth = 200;
    span.offsetWidth = 170;
    b.offsetWidth = 50;

    wrapper.instance().componentDidMount();
    const isMounted = () => wrapper.instance()._isMounted;

    expect( isMounted() ).toEqual( true );

    nodes.forEach( ( n, i ) => {
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( null );
    } );

    nodes.forEach( ( n, i ) => {
      wrapper.instance().setRefWidth( n, names[i] );
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );

    wrapper.instance().componentWillUnmount();
    expect( isMounted() ).toEqual( false );

    wrapper.instance().resetWidths();

    nodes.forEach( ( n, i ) => {
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );
  } );
} );
