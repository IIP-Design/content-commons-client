import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import FilterMenu from '../FilterMenu';
import * as state from '../mocks';

jest.mock(
  '../FilterMenuItem',
  () => function FilterMenuItem() { return ''; }
);
jest.mock(
  '../FilterSelections',
  () => function FilterSelections() { return ''; }
);
jest.mock(
  '../FilterMenuCountries',
  () => function FilterMenuCountries() { return ''; }
);

const mockStore = configureStore( [] );

describe( '<FilterMenu />, if package & document postTypes are selected', () => {
  let store;
  let Component;
  let wrapper;
  let filterMenu;
  let props;

  beforeEach( () => {
    store = mockStore( state.pkgAndDocSelected );

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
      formItem: 'radio'
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
      formItem: 'checkbox'
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
      formItem: 'checkbox'
    } );
  } );

  it( 'renders FilterMenuCountries', () => {
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );
    const { filter } = props;

    expect( countriesMenu.exists() ).toEqual( true );
    expect( countriesMenu.props() ).toEqual( {
      selected: filter.countries
    } );
  } );

  it( 'does not render Categories FilterMenuItem', () => {
    const categoriesMenu = wrapper.find( 'FilterMenuItem[name="categories"]' );
    expect( categoriesMenu.exists() ).toEqual( false );
  } );
} );

describe( '<FilterMenu />, if only package postType is selected', () => {
  let store;
  let Component;
  let wrapper;
  let filterMenu;
  let props;

  beforeEach( () => {
    store = mockStore( state.pkgSelected );

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
      formItem: 'radio'
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
      formItem: 'checkbox'
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
      formItem: 'checkbox'
    } );
  } );

  it( 'does not render FilterMenuCountries', () => {
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );
    expect( countriesMenu.exists() ).toEqual( false );
  } );

  it( 'does not render Categories FilterMenuItem', () => {
    const categoriesMenu = wrapper.find( 'FilterMenuItem[name="categories"]' );
    expect( categoriesMenu.exists() ).toEqual( false );
  } );
} );

describe( '<FilterMenu />, if only document postType is selected', () => {
  let store;
  let Component;
  let wrapper;
  let filterMenu;
  let props;

  beforeEach( () => {
    store = mockStore( state.documentSelected );

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
    const { filter, global } = filterMenu.props();

    expect( dateMenu.exists() ).toEqual( true );
    expect( dateMenu.props() ).toEqual( {
      filter: 'Date Range',
      name: 'date',
      selected: filter.date,
      options: global.dates.list,
      formItem: 'radio'
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
      formItem: 'checkbox'
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
      formItem: 'checkbox'
    } );
  } );

  it( 'renders FilterMenuCountries', () => {
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );
    const { filter } = props;

    expect( countriesMenu.exists() ).toEqual( true );
    expect( countriesMenu.props() ).toEqual( {
      selected: filter.countries
    } );
  } );

  it( 'does not render Categories FilterMenuItem', () => {
    const categoriesMenu = wrapper.find( 'FilterMenuItem[name="categories"]' );
    expect( categoriesMenu.exists() ).toEqual( false );
  } );
} );

describe( '<FilterMenu />, if only postTypes with categories are selected', () => {
  let store;
  let Component;
  let wrapper;
  let filterMenu;
  let props;

  beforeEach( () => {
    store = mockStore( state.postTypeWithCategoriesSelected );

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
      formItem: 'radio'
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
      formItem: 'checkbox'
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
      formItem: 'checkbox'
    } );
  } );

  it( 'does not render FilterMenuCountries', () => {
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );
    expect( countriesMenu.exists() ).toEqual( false );
  } );

  it( 'renders Categories FilterMenuItem', () => {
    const catMenu = wrapper.find( 'FilterMenuItem[name="categories"]' );
    const { filter, global } = props;

    expect( catMenu.exists() ).toEqual( true );
    expect( catMenu.props() ).toEqual( {
      filter: 'Category',
      name: 'categories',
      selected: filter.categories,
      options: global.categories.list,
      formItem: 'checkbox'
    } );
  } );
} );

describe( '<FilterMenu />, if package & document postTypes plus postTypes with categories are selected', () => {
  let store;
  let Component;
  let wrapper;
  let filterMenu;
  let props;

  beforeEach( () => {
    store = mockStore( state.allPostTypesSelected );

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
      formItem: 'radio'
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
      formItem: 'checkbox'
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
      formItem: 'checkbox'
    } );
  } );

  it( 'renders FilterMenuCountries', () => {
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );
    const { filter } = props;

    expect( countriesMenu.exists() ).toEqual( true );
    expect( countriesMenu.props() ).toEqual( {
      selected: filter.countries
    } );
  } );

  it( 'renders Categories FilterMenuItem', () => {
    const catMenu = wrapper.find( 'FilterMenuItem[name="categories"]' );
    const { filter, global } = props;

    expect( catMenu.exists() ).toEqual( true );
    expect( catMenu.props() ).toEqual( {
      filter: 'Category',
      name: 'categories',
      selected: filter.categories,
      options: global.categories.list,
      formItem: 'checkbox'
    } );
  } );
} );

describe( '<FilterMenu />, if no postTypes are selected', () => {
  let store;
  let Component;
  let wrapper;
  let filterMenu;
  let props;

  beforeEach( () => {
    store = mockStore( state.noPostTypesSelected );

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
      formItem: 'radio'
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
      formItem: 'checkbox'
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
      formItem: 'checkbox'
    } );
  } );

  it( 'does not render FilterMenuCountries', () => {
    const countriesMenu = wrapper.find( 'FilterMenuCountries' );
    expect( countriesMenu.exists() ).toEqual( false );
  } );

  it( 'renders Categories FilterMenuItem', () => {
    const catMenu = wrapper.find( 'FilterMenuItem[name="categories"]' );
    const { filter, global } = props;

    expect( catMenu.exists() ).toEqual( true );
    expect( catMenu.props() ).toEqual( {
      filter: 'Category',
      name: 'categories',
      selected: filter.categories,
      options: global.categories.list,
      formItem: 'checkbox'
    } );
  } );
} );