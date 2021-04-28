import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as state from './mocks';
import FilterSelections from '../FilterSelections';

jest.mock(
  '../FilterSelectionItem',
  () => function FilterSelectionItem() { return ''; },
);

const mockStore = configureStore( [] );

describe( '<FilterSelections />', () => {
  let store;
  let Component;
  let wrapper;
  let filterSelections;
  let props;

  beforeEach( () => {
    store = mockStore( state.noCategories );

    Component = (
      <Provider store={ store }>
        <FilterSelections />
      </Provider>
    );

    wrapper = mount( Component );
    filterSelections = wrapper.find( 'FilterSelections' );
    props = filterSelections.props();
  } );

  it( 'renders without crashing', () => {
    expect( filterSelections.exists() ).toEqual( true );
  } );

  it( 'renders an unordered list', () => {
    const ul = filterSelections.find( 'ul[aria-label="applied filters"]' );

    expect( ul.exists() ).toEqual( true );
  } );

  it( 'renders each FilterSelectionItem', () => {
    const { filter } = state.noCategories;
    const selectionItems = filterSelections.find( 'FilterSelectionItem' );
    const values = [filter.date, filter.countries[0]];

    selectionItems.forEach( ( item, i ) => {
      expect( item.prop( 'value' ) ).toEqual( values[i] );
    } );
  } );

  it( 'renders the CLEAR ALL button', () => {
    const btn = filterSelections.find( 'button.label.clear_filter' );

    expect( btn.exists() ).toEqual( true );
    expect( btn.contains( 'CLEAR ALL' ) ).toEqual( true );
    expect( typeof btn.prop( 'onClick' ) ).toEqual( 'function' );
  } );
} );
