import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as state from './mocks';
import SearchTerm from './SearchTerm';

const mockStore = configureStore( [] );

describe( '<FilterSelections />', () => {
  let store;
  let Component;
  let wrapper;
  let searchTerm;
  let props;

  beforeEach( () => {
    store = mockStore( state.mocks );

    Component = (
      <Provider store={ store }>
        <SearchTerm />
      </Provider>
    );

    wrapper = mount( Component );
    searchTerm = wrapper.find( 'SearchTerm' );
    props = searchTerm.props();
  } );

  it( 'renders without crashing', () => {
    expect( searchTerm.exists() ).toEqual( true );
  } );

  it( 'renders a visually hidden h1', () => {
    const hidden = searchTerm.find( 'VisuallyHidden' );
    const h1 = hidden.find( 'h1' );

    expect( h1.contains( 'search results' ) ).toEqual( true );
  } );

  it( 'renders live regions for the search term and hits', () => {
    const liveRegions = searchTerm.find( '[role="status"][aria-live="polite"]' );
    const { term, total } = props.search;
    const content = [term, `${total} items`];

    liveRegions.forEach( ( region, i ) => {
      expect( region.contains( content[i] ) ).toEqual( true );
    } );
  } );
} );
