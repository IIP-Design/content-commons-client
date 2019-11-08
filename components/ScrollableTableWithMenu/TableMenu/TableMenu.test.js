import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import TableMenu from './TableMenu';

const props = {
  columnMenu: [
    { name: 'team', label: 'TEAM' },
    { name: 'categories', label: 'CATEGORIES' },
    { name: 'updatedAt', label: 'MODIFIED DATE' }
  ],
  tableMenuOnChange: jest.fn()
};

const Component = <TableMenu { ...props } />;

describe( '<TableMenu />', () => {
  beforeEach( () => {
    jest.resetAllMocks();
  } );

  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'componentDidMount calls menuHeadersOnMobile', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'menuHeadersOnMobile' );

    inst.componentDidMount();
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'componentDidMount attaches event listeners', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const clickSpy = jest.spyOn( inst, 'toggleTableMenu' )
      .mockImplementation( () => {} );
    const keydownSpy = jest.spyOn( inst, 'handleKbdAccess' )
      .mockImplementation( () => {} );
    const resizeSpy = jest.spyOn( inst, 'menuHeadersOnResize' )
      .mockImplementation( () => {} );

    const map = {};
    window.addEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    inst.componentDidMount();

    map.click();
    expect( clickSpy ).toHaveBeenCalled();

    map.keydown();
    expect( keydownSpy ).toHaveBeenCalled();

    map.resize();
    expect( resizeSpy ).toHaveBeenCalled();
  } );

  it( 'componentWillUnmount removes event listeners', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const clickSpy = jest.spyOn( inst, 'toggleTableMenu' )
      .mockImplementation( () => {} );
    const keydownSpy = jest.spyOn( inst, 'handleKbdAccess' )
      .mockImplementation( () => {} );
    const resizeSpy = jest.spyOn( inst, 'menuHeadersOnResize' )
      .mockImplementation( () => {} );
    const evts = ['click', 'keydown', 'resize'];
    const spies = [clickSpy, keydownSpy, resizeSpy];

    window.removeEventListener = jest.fn();
    inst.componentWillUnmount();

    expect( window.removeEventListener ).toHaveBeenCalledTimes( evts.length );
    evts.forEach( ( e, i ) => {
      expect( window.removeEventListener ).toHaveBeenCalledWith( e, spies[i] );
    } );
  } );

  it( 'getColumns returns an array of columnMenu labels', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const columns = inst.getColumns();

    columns.forEach( ( column, i ) => {
      expect( column ).toEqual( props.columnMenu[i].label );
    } );
  } );

  it( 'componentDidUpdate calls getColumns and handleCheckboxFocus', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const columnsSpy = jest.spyOn( inst, 'getColumns' )
      .mockImplementation( () => {} );
    const checkboxSpy = jest.spyOn( inst, 'handleCheckboxFocus' )
      .mockImplementation( () => {} );

    // check initial state
    expect( inst.state.displayTableMenu ).toEqual( false );

    wrapper.setState( { displayTableMenu: true } );
    expect( inst.state.displayTableMenu ).toEqual( true );
    expect( columnsSpy ).toHaveBeenCalled();
    expect( checkboxSpy ).toHaveBeenCalled();
  } );

  it( 'handleCloseMenu sets displayTableMenu state to false', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    jest.spyOn( inst, 'componentDidUpdate' )
      .mockImplementation( () => {} );

    // set to true first
    wrapper.setState( { displayTableMenu: true } );

    inst.handleCloseMenu();
    expect( inst.state.displayTableMenu ).toEqual( false );
  } );

  it( 'setRef assigns a ref with a name', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    jest.spyOn( inst, 'handleCheckboxFocus' )
      .mockImplementation( () => {} );
    const node = <div>test node</div>;
    const refName = 'TEAM';

    wrapper.setState( { displayTableMenu: true } );
    inst.setRef( node, refName );

    expect( inst[refName].type ).toEqual( 'div' );
    expect( inst[refName].props.children ).toEqual( 'test node' );
  } );

  it( 'toggleCheckbox sets menuHeaders in state', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const e = {};
    const data = { 'data-proplabel': 'TEAM' };
    const newData = { 'data-proplabel': 'CATEGORIES' };
    const newestData = { 'data-proplabel': 'TEAM' };

    // check the TEAM box
    inst.toggleCheckbox( e, data );
    expect( wrapper.state( 'menuHeaders' ).length )
      .toEqual( Object.keys( data ).length );
    expect( wrapper.state( 'menuHeaders' ) )
      .toEqual( [data['data-proplabel']] );

    // check the CATEGORIES box
    inst.toggleCheckbox( e, newData );
    expect( wrapper.state( 'menuHeaders' ).length )
      .toEqual( Object.keys( data ).length + Object.keys( newData ).length );
    expect( wrapper.state( 'menuHeaders' ) )
      .toEqual( [data['data-proplabel'], newData['data-proplabel']] );

    // uncheck the TEAM box
    inst.toggleCheckbox( e, newestData );
    expect( wrapper.state( 'menuHeaders' ).length )
      .toEqual( Object.keys( newData ).length );
    expect( wrapper.state( 'menuHeaders' ) )
      .toEqual( [newData['data-proplabel']] );
  } );

  it( 'menuHeadersOnMobile sets menuHeaders in state for mobile', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const libBrowser = require( 'lib/browser' ); // eslint-disable-line
    libBrowser.isMobile = jest.fn( () => true );

    inst.menuHeadersOnMobile();
    expect( wrapper.state( 'menuHeaders' ) )
      .toEqual( props.columnMenu.map( m => m.label ) );
  } );

  it( 'handleTableScroll scrolls the dashboard table left and right', () => {
    const div = document.createElement( 'div' );
    div.classList.add( 'items_table' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );
    const inst = wrapper.instance();
    const e = { target: { dataset: { tablearrow: 'right' } } };

    // initial scrollLeft value
    expect( window.domNode.scrollLeft ).toEqual( 0 );

    // scroll right once
    inst.handleTableScroll( e );
    expect( window.domNode.scrollLeft ).toEqual( inst._scrollPixels );

    // scroll right second time
    inst.handleTableScroll( e );
    expect( window.domNode.scrollLeft ).toEqual( inst._scrollPixels * 2 );

    // scroll left once
    e.target.dataset.tablearrow = 'left';
    inst.handleTableScroll( e );
    expect( window.domNode.scrollLeft ).toEqual( inst._scrollPixels );

    // scroll left second time
    inst.handleTableScroll( e );
    expect( window.domNode.scrollLeft ).toEqual( 0 );
  } );

  it( 'toggleTableMenu toggles displayTableMenu in state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const { displayTableMenu } = wrapper.state();
    const e = {
      target: {
        id: 'show-more-columns',
        dataset: { tablemenu: true },
        parentNode: { dataset: { tablemenuitem: true } }
      }
    };

    // initial displayTableMenu value
    expect( wrapper.state( 'displayTableMenu' ) )
      .toEqual( displayTableMenu );

    // call toggleTableMenu
    inst.toggleTableMenu( e );
    expect( wrapper.state( 'displayTableMenu' ) )
      .toEqual( !displayTableMenu );

    // test isTableMenuItem
    e.target.dataset.tablemenu = false;
    inst.toggleTableMenu( e );
    expect( wrapper.state( 'displayTableMenu' ) ).toEqual( true );

    e.target.parentNode.dataset.tablemenuitem = false;
    e.target.dataset.tablemenuitem = true;
    inst.toggleTableMenu( e );
    expect( wrapper.state( 'displayTableMenu' ) ).toEqual( true );

    // test isShowMoreColumns
    e.target.dataset.tablemenuitem = false;
    inst.toggleTableMenu( e );
    expect( wrapper.state( 'displayTableMenu' ) ).toEqual( true );

    // default
    e.target.id = 'some-other-id-value';
    inst.toggleTableMenu( e );
    expect( wrapper.state( 'displayTableMenu' ) ).toEqual( false );
  } );

  it( 'pressing Escape/Tab calls handleKbdAccess and handleCloseMenu', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleCloseMenu' );
    jest.spyOn( inst, 'handleCheckboxFocus' )
      .mockImplementation( () => {} );

    const e = {
      key: '',
      target: { id: '0', type: 'checkbox' },
      preventDefault: jest.fn()
    };

    const keys = ['Escape', 'Tab'];

    // first, display the dropdown menu
    wrapper.setState( { displayTableMenu: true } );

    keys.forEach( key => {
      e.key = key;
      inst.handleKbdAccess( e );
      expect( spy ).toHaveBeenCalled();
      expect( e.preventDefault ).not.toHaveBeenCalled();
    } );
  } );

  it( 'pressing ArrowDown calls handleKbdAccess, handleCheckboxFocus, and preventDefault', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleCheckboxFocus' )
      .mockImplementation( () => {} );

    const e = {
      key: 'ArrowDown',
      target: { id: '', type: 'checkbox' },
      preventDefault: jest.fn()
    };

    const columns = inst.getColumns();
    const current = () => columns.indexOf( e.target.id );

    // first, display the dropdown menu
    wrapper.setState( { displayTableMenu: true } );

    columns.forEach( column => {
      e.target.id = column;
      inst.handleKbdAccess( e );
      expect( e.preventDefault ).toHaveBeenCalled();
      if ( current() === columns.length - 1 ) {
        expect( spy ).toHaveBeenCalledWith( columns, 0 );
      } else {
        expect( spy ).toHaveBeenCalledWith( columns, current() + 1 );
      }
    } );
  } );

  it( 'pressing ArrowUp calls handleKbdAccess, handleCheckboxFocus, and preventDefault', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleCheckboxFocus' )
      .mockImplementation( () => {} );

    const e = {
      key: 'ArrowUp',
      target: { id: '', type: 'checkbox' },
      preventDefault: jest.fn()
    };

    const columns = inst.getColumns();
    const current = () => columns.indexOf( e.target.id );

    // first, display the dropdown menu
    wrapper.setState( { displayTableMenu: true } );

    columns.forEach( column => {
      e.target.id = column;
      inst.handleKbdAccess( e );
      expect( e.preventDefault ).toHaveBeenCalled();
      if ( current() === 0 ) {
        expect( spy ).toHaveBeenCalledWith( columns, columns.length - 1 );
      } else {
        expect( spy ).toHaveBeenCalledWith( columns, current() - 1 );
      }
    } );
  } );

  it( 'pressing Home calls handleKbdAccess, handleCheckboxFocus, and preventDefault', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleCheckboxFocus' )
      .mockImplementation( () => {} );

    const e = {
      key: 'Home',
      target: { id: '', type: 'checkbox' },
      preventDefault: jest.fn()
    };

    const columns = inst.getColumns();

    // first, display the dropdown menu
    wrapper.setState( { displayTableMenu: true } );

    columns.forEach( column => {
      e.target.id = column;
      inst.handleKbdAccess( e );
      expect( spy ).toHaveBeenCalledWith( columns, 0 );
      expect( e.preventDefault ).toHaveBeenCalled();
    } );
  } );

  it( 'pressing End calls handleKbdAccess, handleCheckboxFocus, and preventDefault', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleCheckboxFocus' )
      .mockImplementation( () => {} );

    const e = {
      key: 'End',
      target: { id: '', type: 'checkbox' },
      preventDefault: jest.fn()
    };

    const columns = inst.getColumns();

    // first, display the dropdown menu
    wrapper.setState( { displayTableMenu: true } );

    columns.forEach( column => {
      e.target.id = column;
      inst.handleKbdAccess( e );
      expect( spy ).toHaveBeenCalledWith( columns, columns.length - 1 );
      expect( e.preventDefault ).toHaveBeenCalled();
    } );
  } );

  it( 'disables the left and right scroll arrow buttons if the number of additional columns is less than 2', () => {
    const wrapper = shallow( Component );
    const arrowBtns = () => wrapper.find( 'button[data-tablearrow]' );
    const menuHeadersCount = () => wrapper.state( 'menuHeaders' ).length;
    const isDisabled = () => menuHeadersCount() < 2;

    expect( menuHeadersCount() ).toEqual( 0 );
    arrowBtns().forEach( btn => {
      expect( btn.prop( 'disabled' ) ).toEqual( isDisabled() );
    } );

    wrapper.setState( { menuHeaders: ['TEAM', 'CATEGORIES'] } );
    expect( menuHeadersCount() ).toEqual( 2 );
    arrowBtns().forEach( btn => {
      expect( btn.prop( 'disabled' ) ).toEqual( isDisabled() );
    } );
  } );

  it( 'global click event calls toggleTableMenu', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const cb = jest.spyOn( inst, 'toggleTableMenu' )
      .mockImplementation( () => {} );
    inst.handleCheckboxFocus = jest.fn( () => {} );

    const map = {};
    window.addEventListener = jest.fn( () => {
      map.click = cb;
    } );

    // open the menu
    wrapper.setState( { displayTableMenu: true } );
    expect( inst.state.displayTableMenu ).toEqual( true );

    // close menu with global click
    inst.componentDidMount();
    map.click();
    expect( cb ).toHaveBeenCalled();
  } );
} );
