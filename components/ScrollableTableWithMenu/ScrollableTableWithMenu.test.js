import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import ScrollableTableWithMenu from './ScrollableTableWithMenu';

jest.mock( 'next/dynamic', () => () => 'dynamically-imported-component' );
jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

// mock these components since they are tested separately
jest.mock( './TableHeader/TableHeader', () => function TableHeader() {
  return <thead><tr><th>TableHeader</th></tr></thead>;
} );
jest.mock( './TableBody/TableBody', () => function TableBody() {
  return <tbody><tr><td>TableBody</td></tr></tbody>;
} );
jest.mock( './TableItemsDisplay/TableItemsDisplay', () => () => 'TableItemsDisplay' );
jest.mock( './TableSearch/TableSearch', () => () => 'TableSearch' );
jest.mock( './TableMenu/TableMenu', () => () => 'TableMenu' );
jest.mock( './TableActionsMenu/TableActionsMenu', () => () => 'TableActionsMenu' );
jest.mock( './TablePagination/TablePagination', () => () => 'TablePagination' );

const resizeWindow = ( x, y ) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent( new Event( 'resize' ) );
};

const props = {
  persistentTableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'createdAt', label: 'CREATED' },
    { name: 'author', label: 'AUTHOR' },
  ],
  columnMenu: [
    { name: 'team', label: 'TEAM' },
    { name: 'categories', label: 'CATEGORIES' },
    { name: 'updatedAt', label: 'MODIFIED DATE' },
  ],
  team: 'IIP Video Production',
  projectTab: 'teamProjects',
};

const Component = <ScrollableTableWithMenu { ...props } />;

describe.skip( '<ScrollableTableWithMenu />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'sets initial state values', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();

    expect( inst.state ).toEqual( {
      tableHeaders: props.persistentTableHeaders,
      selectedItems: new Map(),
      hasSelectedAllItems: false,
      displayActionsMenu: false,
      column: null,
      direction: null,
      windowWidth: null,
      searchTerm: '',
      activePage: 1,
      itemsPerPage: 15,
      skip: 0,
    } );
  } );

  it( 'componentDidMount calls tableMenuSelectionsOnMobile and adds resize event listener', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'tableMenuSelectionsOnMobile' );
    const cb = jest.spyOn( inst, 'tableMenuSelectionsOnResize' );
    const event = 'resize';

    const map = {};

    window.addEventListener = jest.fn( () => {
      map[event] = cb;
    } );

    inst.componentDidMount();
    expect( spy ).toHaveBeenCalled();
    expect( window.addEventListener ).toHaveBeenCalledWith( event, cb );
  } );

  it( 'componentWillUnmount removes resize event listener', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const cb = jest.spyOn( inst, 'tableMenuSelectionsOnResize' );
    const event = 'resize';

    const map = {};

    window.removeEventListener = jest.fn( () => {
      map[event] = cb;
    } );

    inst.componentWillUnmount();
    expect( window.removeEventListener ).toHaveBeenCalledWith( event, cb );
  } );

  it( 'componentDidUpdate calls handleResetActivePage if itemsPerPage changes in state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleResetActivePage' );
    const prevProps = {};
    const prevState = { itemsPerPage: 15 };

    // if itemsPerPage is unchanged
    expect( prevState.itemsPerPage ).toEqual( inst.state.itemsPerPage );
    expect( spy ).not.toHaveBeenCalled();

    // if itemsPerPage changes
    wrapper.setState( { itemsPerPage: 25 } );
    inst.componentDidUpdate( prevProps, prevState );
    expect( prevState.itemsPerPage )
      .not.toEqual( inst.state.itemsPerPage );
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'handleItemsPerPageChange sets itemsPerPage in state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const e = {};
    const value = 25;

    // initial value
    expect( inst.state.itemsPerPage ).toEqual( 15 );

    inst.handleItemsPerPageChange( e, value );
    expect( inst.state.itemsPerPage ).toEqual( value );
  } );

  it( 'handlePageChange sets/resets selectedItems, displayActionsMenu, activePage, and skip in state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const prevState = { itemsPerPage: 15 };
    const e = {};
    const data = { activePage: 2 };

    /**
     * initial values (set selectedItems since
     * handlePageChange will reset to `new Map()`
     * and `false` )
     */
    wrapper.setState( {
      selectedItems: new Map( [['ud78', true], ['ud98', true]] ),
      displayActionsMenu: true,
    } );
    expect( inst.state.selectedItems )
      .toEqual( new Map( [['ud78', true], ['ud98', true]] ) );
    expect( inst.state.displayActionsMenu ).toEqual( true );
    expect( inst.state.activePage ).toEqual( 1 );
    expect( inst.state.skip ).toEqual( 0 );

    // change page
    inst.handlePageChange( e, data );
    expect( inst.state.selectedItems ).toEqual( new Map() );
    expect( inst.state.displayActionsMenu ).toEqual( false );
    expect( inst.state.activePage ).toEqual( data.activePage );
    expect( inst.state.skip )
      .toEqual( ( data.activePage - 1 ) * prevState.itemsPerPage );
  } );

  it( 'handleResetActivePage resets activePage and skip in state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();

    // set non-default values
    wrapper.setState( { activePage: 3, skip: 30 } );
    expect( inst.state.activePage ).toEqual( 3 );
    expect( inst.state.skip ).toEqual( 30 );

    // reset values
    inst.handleResetActivePage();
    expect( inst.state.activePage ).toEqual( 1 );
    expect( inst.state.skip ).toEqual( 0 );
  } );

  it( 'handleResetSelections resets selectedItems and displayActionsMenu in state and calls handleResetActivePage', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleResetActivePage' );

    /**
     * initial values (set selectedItems since
     * handleResetSelections will reset to `new Map()`
     * and `false` )
     */
    wrapper.setState( {
      selectedItems: new Map( [['ud78', true], ['ud98', true]] ),
      displayActionsMenu: true,
    } );
    expect( inst.state.selectedItems )
      .toEqual( new Map( [['ud78', true], ['ud98', true]] ) );
    expect( inst.state.displayActionsMenu ).toEqual( true );

    // reset selections
    inst.handleResetSelections();
    expect( inst.state.selectedItems ).toEqual( new Map() );
    expect( inst.state.displayActionsMenu ).toEqual( false );
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'handleSearchSubmit sets a search term in state and calls handleResetActivePage', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleResetActivePage' );
    const e = { preventDefault: jest.fn() };
    const term = 'economy';

    // initial value
    expect( inst.state.searchTerm ).toEqual( '' );

    // set search term
    inst.handleSearchSubmit( e, term );
    expect( inst.state.searchTerm ).toEqual( term );
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'handleSort sets column and direction in state and calls handleResetActivePage', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'handleResetActivePage' );
    let clickedColumn = 'createdAt';

    // initial sort
    inst.handleSort( clickedColumn )();
    expect( inst.state.displayActionsMenu ).toEqual( false );
    expect( inst.state.column ).toEqual( clickedColumn );
    expect( inst.state.direction ).toEqual( 'ascending' );
    expect( spy ).toHaveBeenCalledTimes( 1 );

    // select same column, but second time changes direction
    inst.handleSort( clickedColumn )();
    expect( inst.state.displayActionsMenu ).toEqual( false );
    expect( inst.state.column ).toEqual( clickedColumn );
    expect( inst.state.direction ).toEqual( 'descending' );
    expect( spy ).toHaveBeenCalledTimes( 2 );

    // sort with a different column
    clickedColumn = 'projectTitle';
    inst.handleSort( clickedColumn )();
    expect( inst.state.displayActionsMenu ).toEqual( false );
    expect( inst.state.column ).toEqual( clickedColumn );
    expect( inst.state.direction ).toEqual( 'ascending' );
    expect( spy ).toHaveBeenCalledTimes( 3 );

    /**
     * early return if displayActionsMenu;
     * column & direction same as previous;
     * spy called same number of times as previous
     */
    wrapper.setState( { displayActionsMenu: true } );
    inst.handleSort( clickedColumn )();
    expect( inst.state.displayActionsMenu ).toEqual( true );
    expect( inst.state.column ).toEqual( clickedColumn );
    expect( inst.state.direction ).toEqual( 'ascending' );
    expect( spy ).toHaveBeenCalledTimes( 3 );
  } );

  it( 'tableMenuOnChange sets tableHeaders in state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const e = {
      persist: jest.fn(),
      target: {
        parentNode: {
          dataset: {
            propname: 'visibility',
            proplabel: 'VISIBILITY',
          },
        },
      },
    };

    // initial value
    expect( inst.state.tableHeaders )
      .toEqual( props.persistentTableHeaders );

    // existing persistent header column
    inst.tableMenuOnChange( e );
    expect( inst.state.tableHeaders )
      .toEqual( props.persistentTableHeaders.filter(
        h => h.name !== e.target.parentNode.dataset.propname,
      ) );

    // add a new header column
    e.target.parentNode.dataset.propname = 'updatedAt';
    e.target.parentNode.dataset.proplabel = 'MODIFIED DATE';
    inst.tableMenuOnChange( e );
    expect( inst.state.tableHeaders )
      .toEqual( [
        ...props.persistentTableHeaders.filter(
          h => h.name !== 'visibility',
        ), props.columnMenu[2],
      ] );
  } );

  it( 'tableMenuSelectionsOnResize sets tableHeaders and windowWidth in state', async () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const dimensions = { x: 600, y: 600 };

    // set the window width
    resizeWindow( dimensions.x, dimensions.y );

    inst.tableMenuSelectionsOnResize();
    // wait for debounce
    await wait( inst.TIMEOUT_DELAY );
    expect( window.innerWidth ).toEqual( dimensions.x );
    expect( inst.state.windowWidth ).toEqual( window.innerWidth );
  } );

  it( 'tableMenuSelectionsOnMobile sets tableHeaders state for mobile devices', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const libBrowser = require( 'lib/browser' ); // eslint-disable-line

    libBrowser.isMobile = jest.fn( () => true );

    inst.tableMenuSelectionsOnMobile();
    expect( inst.state.tableHeaders )
      .toEqual( [...props.persistentTableHeaders, ...props.columnMenu] );
  } );

  it( 'toggleAllItemsSelection toggles selection of all items and sets hasSelectedAllItems and displayActionsMenu in state', () => {
    const div = document.createElement( 'div' );

    div.setAttribute( 'data-label', 'id-123' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );
    const inst = wrapper.instance();
    const e = { stopPropagation: jest.fn() };

    wrapper.setState( { hasSelectedAllItems: false } );
    inst.toggleAllItemsSelection( e );

    expect( inst.state.selectedItems )
      .toEqual( new Map( [['id-123', true]] ) );
    expect( inst.state.hasSelectedAllItems ).toEqual( true );
    expect( inst.state.displayActionsMenu ).toEqual( true );
  } );

  it( 'toggleItemSelection toggles selection of an item and sets displayActionsMenu in state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const e = { stopPropagation: jest.fn() };
    const item1 = { checked: true, 'data-label': 'id-123' };
    const item2 = { checked: true, 'data-label': 'id-456' };

    // select items
    inst.toggleItemSelection( e, item1 );
    inst.toggleItemSelection( e, item2 );
    expect( inst.state.selectedItems )
      .toEqual( new Map(
        [['id-123', item1.checked], ['id-456', item2.checked]],
      ) );
    expect( inst.state.displayActionsMenu )
      .toEqual( item1.checked || item2.checked );

    // unselect one item
    item1.checked = false;
    inst.toggleItemSelection( e, item1 );
    expect( inst.state.selectedItems )
      .toEqual( new Map(
        [['id-123', item1.checked], ['id-456', item2.checked]],
      ) );
    expect( inst.state.displayActionsMenu )
      .toEqual( item1.checked || item2.checked );
  } );
} );
