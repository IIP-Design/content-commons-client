import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import FilterMenuItem from '../FilterMenuItem';
import * as state from './mocks';

const mockStore = configureStore( [] );
const store = mockStore( state.noCategories );

const propsFilterRadio = {
  selected: ['recent'],
  filter: "Date Range",
  name: "date",  
  options: state.noCategories.global.dates.list,
  formItem: "radio"
}

const propsFilterCheckbox = {
  selected: ['video'],
  filter: "Release Type",
  name: "postTypes",
  options: state.noCategories.global.postTypes.list,
  formItem: "checkbox"
};

const propsSubFilter = {
  className: "subfilter",
  selected: ['Background Briefing', 'Department Press Briefing'],
  filter: "Release Type",
  name: "documentUses",
  options: state.noCategories.global.documentUses.list,
  formItem: "checkbox"
};

const allProps = [propsFilterRadio, propsFilterCheckbox, propsSubFilter];

const ComponentRadio = (
  <Provider store={ store }>
    <FilterMenuItem {...propsFilterRadio} />
  </Provider>
);

const ComponentCheckbox = (
  <Provider store={ store }>
    <FilterMenuItem {...propsFilterCheckbox} />
  </Provider>
);

const ComponentSubFilter = (
  <Provider store={ store }>
    <FilterMenuItem {...propsSubFilter} />
  </Provider>
);

const wrapperRadio = mount( ComponentRadio ),
      wrapperChecbox = mount( ComponentCheckbox ),
      wrapperSubFilter = mount( ComponentSubFilter );

const Components = [wrapperRadio, wrapperChecbox, wrapperSubFilter];

describe( '<FilterMenuItem />', () => {

  it( 'renders w/o crashing', () => {      
      Components.forEach( wrapper => {
        expect( wrapper.exists() ).toEqual( true );
        expect( wrapper.find( 'FilterMenuItem' ).exists() ).toEqual( true );
      } );      
    } );  

it( 'renders the correct selected prop', () => {
      Components.forEach( ( wrapper, index ) => {
        const filterMenuItem = wrapper.find( 'FilterMenuItem' );
        expect( filterMenuItem.prop( 'selected' ) ).toEqual( allProps[index].selected );
      } );
  } );

it( 'renders the correct filter prop', () => {
    Components.forEach( ( wrapper, index ) => {
      const filterMenuItem = wrapper.find( 'FilterMenuItem' );
      expect( filterMenuItem.prop( 'filter' ) ).toEqual( allProps[index].filter );
    } );
  } );

it( 'renders the correct name prop', () => {
    Components.forEach( ( wrapper, index ) => {
      const filterMenuItem = wrapper.find( 'FilterMenuItem' );
      expect( filterMenuItem.prop( 'name' ) ).toEqual( allProps[index].name );
    } );
  } );

it( 'renders the correct options', () => {
    Components.forEach( ( wrapper, index ) => {
      const filterMenuItem = wrapper.find( 'FilterMenuItem' );
      expect( filterMenuItem.prop( 'options' ) ).toEqual( allProps[index].options );
    } );
  } );

it( 'renders the correct formItem', () => {
    Components.forEach( ( wrapper, index ) => {
      const filterMenuItem = wrapper.find( 'FilterMenuItem' );
      expect( filterMenuItem.prop( 'formItem' ) ).toEqual( allProps[index].formItem );
    } );
  } );

it( 'renders the correct className for the subfilters', () => {
    const subFilterMenuItem = wrapperSubFilter.find( 'FilterMenuItem' );
    expect( subFilterMenuItem.prop( 'className' ) ).toEqual( 'subfilter' );
  } );

it( 'renders the correct display label', () => {
    Components.forEach( ( wrapper, index ) => {
      const filterLabel = wrapper.find( 'FilterMenuItem .filterMenu_label' );
      expect( filterLabel.exists() ).toEqual( true );
      expect( filterLabel.text().trim() ).toEqual( allProps[index].filter );
    } );
  } );

it( 'renders the correct child components and labels', () => {
    Components.forEach( ( wrapper, i ) => {
      const filterMenuItem = wrapper.find( 'FilterMenuItem' );
    
      const FormChildComponents = i === 0 ? filterMenuItem.find('FormRadio') : filterMenuItem.find('FormCheckbox');
      expect( FormChildComponents.length ).toEqual( allProps[i].options.length );

      FormChildComponents.forEach( ( component, index ) => {
        expect( component.prop( 'label' ) ).toEqual( allProps[i].options[index].display_name );
      } );
    } ); 
  } );

} );
