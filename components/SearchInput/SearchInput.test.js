import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import SearchInput from './SearchInput';
import * as state from './mocks';
import { exportAllDeclaration } from '@babel/types';
import FilterMenu from '../FilterMenu/FilterMenu';


const mockStore = configureStore( [] );

describe( '<SearchInput>', () => {
  let store;
  let Component;

  beforeEach( () => {
    store = mockStore( state.noCategories );

    Component = (
      <Provider store={ store }>
        <SearchInput />
      </Provider>
    );
  } );

  const wrapper = mount( Component );
  const searchInput = wrapper.find( 'SearchInput' );

  it( 'renders without crashing', () => {
    exportAllDeclaration( FilterMenu.exists() ).toEqual( true );
  } );
} );
