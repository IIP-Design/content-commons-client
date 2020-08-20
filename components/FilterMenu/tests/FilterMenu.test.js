import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import FilterMenu from '../FilterMenu';
import * as state from './mocks';

jest.mock(
  '../FilterMenuItem',
  () => function FilterMenuItem() { return ''; },
);
jest.mock(
  '../FilterSelections',
  () => function FilterSelections() { return ''; },
);
jest.mock(
  '../FilterSubMenu/FilterSubMenu',
  () => function FilterSubMenu() { return ''; },
);

const mockStore = configureStore( [] );

describe( '<FilterMenu />', () => {
  let store;
  let Component;
  let wrapper;
  let filterMenu;
  let props;

  beforeEach( () => {
    store = mockStore( state.noCategories );

    Component = (
      <Provider store={ store }>
        <FilterMenu />
      </Provider>
    );

    wrapper = mount( Component );
    filterMenu = wrapper.find( 'FilterMenu' );
    props = filterMenu.props();
  } );

  it( 'renders without crashing', () => {
    expect( filterMenu.exists() ).toEqual( true );
  } );

  it( 'renders section wrapper', () => {
    const section = wrapper.find( 'section.filterMenu_wrapper' );

    expect( section.exists() ).toEqual( true );
  } );

  it( 'renders main wrapper', () => {
    const div = wrapper.find( 'div.filterMenu_main' );

    expect( div.exists() ).toEqual( true );
  } );

  it( 'renders Date FilterMenuItem', () => {
    const dateMenu = wrapper.find( 'FilterMenuItem[name="date"]' );
    const { filter, global } = props;

    expect( dateMenu.exists() ).toEqual( true );
    expect( dateMenu.props() ).toEqual( {
      filter: 'Date Range',
      name: 'date',
      selected: filter.date,
      options: global.dates.list,
      formItem: 'radio',
    } );
  } );

  it( 'renders Format FilterMenuItem', () => {
    const formatMenu = wrapper.find( 'FilterMenuItem[name="postTypes"]' );
    const { filter, global } = props;

    expect( formatMenu.exists() ).toEqual( true );
    expect( formatMenu.props() ).toEqual( {
      filter: 'Format',
      name: 'postTypes',
      selected: filter.postTypes,
      options: global.postTypes.list,
      formItem: 'checkbox',
    } );
  } );

  it( 'renders Source FilterMenuItem', () => {
    const sourcesMenu = wrapper.find( 'FilterMenuItem[name="sources"]' );
    const { filter, global } = props;

    expect( sourcesMenu.exists() ).toEqual( true );
    expect( sourcesMenu.props() ).toEqual( {
      filter: 'Source',
      name: 'sources',
      selected: filter.sources,
      options: global.sources.list,
      formItem: 'checkbox',
    } );
  } );

  it( 'renders Categories FilterMenuItem', () => {
    const catMenu = wrapper.find( 'FilterMenuItem[name="categories"]' );

    expect( catMenu.exists() ).toEqual( true );
  } );

  it( 'renders FilterSubMenu', () => {
    const filterSubMenu = wrapper.find( 'FilterSubMenu' );

    expect( filterSubMenu.exists() ).toEqual( true );
  } );
} );
