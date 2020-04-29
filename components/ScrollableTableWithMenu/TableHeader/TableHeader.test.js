import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { DashboardContext } from '../../../context/dashboardContext';
import TableHeader from './TableHeader';

const props = {
  tableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'createdAt', label: 'CREATED' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'author', label: 'AUTHOR' }
  ],
  handleSort: jest.fn(),
  displayActionsMenu: false
};

jest.mock( 'react', () => ( {
  ...jest.requireActual( 'react' ),
  useContext: () => ( { state: { column: 'author', direction: 'descending' } } )
} ) );

const createTable = tableProps => (
  <DashboardContext.Provider>
    <table>
      <TableHeader { ...tableProps } />
    </table>
  </DashboardContext.Provider>
);

describe( '<TableHeader />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( createTable( props ) );

    const header = wrapper.find( 'TableHeader' );

    expect( header.exists() ).toEqual( true );
    expect( toJSON( header ) ).toMatchSnapshot();
  } );

  it( 'renders the correct table header values', () => {
    const wrapper = mount( createTable( props ) );
    const th = wrapper.find( 'th' );

    th.forEach( ( t, i ) => {
      expect( t.text() ).toEqual( props.tableHeaders[i].label );
    } );
  } );

  it( 'renders the correct table header class value if displayActionsMenu', () => {
    const newProps = { ...props, displayActionsMenu: true };
    const wrapper = mount( createTable( newProps ) );

    const th = wrapper.find( 'th' );

    th.forEach( t => {
      expect( t.prop( 'className' ) ).toContain( 'displayActionsMenu' );
    } );
  } );

  it( 'renders the correct table header sorted and direction values if `column === header.name`', () => {
    const wrapper = mount( createTable( props ) );

    const cell = wrapper.find( 'TableHeaderCell' );

    cell.forEach( c => {
      if ( c.prop( 'children' ) === 'AUTHOR' ) {
        expect( c.prop( 'sorted' ) ).toEqual( 'descending' );
      } else {
        expect( c.prop( 'sorted' ) ).toEqual( null );
      }
    } );
  } );
} );
