import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import FilterSubMenu from '../FilterSubMenu/FilterSubMenu';
import * as state from './mocks';

jest.mock(
  '../FilterSubMenu/PressSubMenu/PressSubMenu',
  () => function PressSubMenu() { return ''; },
);

const mockStore = configureStore( [] );

describe( '<FilterSubMenu />', () => {
  let store;
  let Component;
  let wrapper;
  let filterSubMenu;

  beforeEach( () => {
    store = mockStore( state.noCategories );

    Component = (
      <Provider store={ store }>
        <FilterSubMenu />
      </Provider>
    );

    wrapper = mount( Component );
    filterSubMenu = wrapper.find( 'FilterSubMenu' );
  } );

  it( 'renders w/o crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the PressSubMenu', () => {
    const pressSubmenu = wrapper.find( 'PressSubMenu' );

    expect( pressSubmenu.exists() ).toEqual( true );
  } );
} );
