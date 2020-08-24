import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import PressSubMenu from '../FilterSubMenu/PressSubMenu/PressSubMenu';
import * as state from './mocks';

jest.mock(
  '../FilterSubMenu/PressSubMenu/ReleaseTypeSubmenu',
  () => function ReleaseTypeSubmenu() { return ''; },
);

jest.mock(
  '../FilterSubMenu/PressSubMenu/BureausOfficesSubmenu',
  () => function BureausOfficesSubmenu() { return ''; },
);

jest.mock(
  '../FilterSubMenu/PressSubMenu/FilterMenuCountries',
  () => function FilterMenuCountries() { return ''; },
);

const mockStore = configureStore( [] );

describe( '<PressSubMenu />', () => {
  let store;
  let Component;
  let wrapper;
  let pressSubMenu;

  beforeEach( () => {
    store = mockStore( state.noCategories );

    Component = (
      <Provider store={ store }>
        <PressSubMenu />
      </Provider>
    );

    wrapper = mount( Component );
    pressSubMenu = wrapper.find( 'PressSubMenu' );
  } );

  it( 'renders w/o crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the label text', () => {
    const labelText = wrapper.find( '.filterSubMenu_label' );

    expect( labelText.exists() ).toEqual( true );
    expect( labelText.text() ).toEqual( 'Press Releases & Guidance: ' );
  } );

  it( 'renders the sub filters', () => {
    const releaseTypeFilter = wrapper.find( 'ReleaseTypeSubmenu' );
    const bureausOfficesFilter = wrapper.find( 'BureausOfficesSubmenu' );
    const countriesFilter = wrapper.find( 'FilterMenuCountries' );

    [
      releaseTypeFilter, bureausOfficesFilter, countriesFilter,
    ].forEach( filter => {
      expect( filter.exists() ).toEqual( true );
    } );

    expect( releaseTypeFilter.props( 'selected' ).selected ).toEqual( state.noCategories.filter.documentUses );
    expect( bureausOfficesFilter.props( 'selected' ).selected ).toEqual( state.noCategories.filter.bureausOffices );
    expect( countriesFilter.props( 'selected' ).selected ).toEqual( state.noCategories.filter.countries );
  } );
} );
