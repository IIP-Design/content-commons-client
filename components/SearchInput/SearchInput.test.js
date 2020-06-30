import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import SearchInput from './SearchInput';
import * as state from './mocks';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: {} } ) );
jest.mock( 'context/authContext', () => ( {
  useAuth: jest.fn( () => true ),
} ) );

const mockStore = configureStore( [] );

describe( '<SearchInput />', () => {
  let store;
  let Component;
  let wrapper;
  let searchInput;

  beforeEach( () => {
    store = mockStore( state.noCategories );

    Component = (
      <Provider store={ store }>
        <SearchInput />
      </Provider>
    );

    wrapper = mount( Component );
    searchInput = wrapper.find( 'SearchInput' );
  } );

  it( 'renders without crashing', () => {
    expect( searchInput.exists() ).toEqual( true );
  } );
} );
