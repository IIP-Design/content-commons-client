import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import BureausOfficesSubmenu from '../FilterSubMenu/PressSubMenu/BureausOfficesSubmenu';
import * as state from './mocks';

jest.mock(
  'components/FilterMenu/FilterMenuItem',
  () => function FilterMenuItem() { return ''; },
);

const mockStore = configureStore( [] );

const props = {
  selected: ['Bureau of Administration', 'Bureau of African Affairs'],
};

describe( '<BureausOfficesSubmenu', () => {
  let store;
  let Component;

  let wrapper;
  let filterMenuItem;

  beforeEach( () => {
    store = mockStore( state.noCategories );
    Component = (
      <Provider store={ store }>
        <BureausOfficesSubmenu { ...props } />
      </Provider>
    );
    wrapper = mount( Component );
    filterMenuItem = wrapper.find( 'FilterMenuItem' );
  } );

  it( 'renders w/o crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className', () => {
    expect( filterMenuItem.prop( 'className' ) ).toEqual( 'subfilter' );
  } );

  it( 'renders the correct selected prop', () => {
    expect( filterMenuItem.prop( 'selected' ) ).toEqual( props.selected );
  } );

  it( 'renders the correct filter name', () => {
    expect( filterMenuItem.prop( 'filter' ) ).toEqual( 'Bureaus & Offices' );
  } );

  it( 'renders the correct name prop', () => {
    expect( filterMenuItem.prop( 'name' ) ).toEqual( 'bureausOffices' );
  } );

  it( 'renders the correct menu options', () => {
    const bureausOfficesOptionsSample = [
      {
        display_name: 'Office of the Chief of Protocol',
        key: 'Office of the Chief of Protocol',
        isBureau: true,
        submenu: 'document',
      },
      {
        display_name: 'Office of the Coordinator for Cyber Issues',
        key: 'Office of the Coordinator for Cyber Issues',
        isBureau: true,
        submenu: 'document',
      },
      {
        display_name: 'Office of the Legal Adviser',
        key: 'Office of the Legal Adviser',
        isBureau: true,
        submenu: 'document',
      },
      {
        display_name: 'Office of Procurement Executive',
        key: 'Office of Procurement Executive',
        submenu: 'document',
      },
    ];

    expect( filterMenuItem.prop( 'options' ) ).toEqual( bureausOfficesOptionsSample );
  } );

  it( 'renders the correct formItem prop', () => {
    expect( filterMenuItem.prop( 'formItem' ) ).toEqual( 'checkbox' );
  } );
} );
