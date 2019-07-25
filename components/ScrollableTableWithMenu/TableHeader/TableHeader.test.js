import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import TableHeader from './TableHeader';

const props = {
  tableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'createdAt', label: 'CREATED' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'author', label: 'AUTHOR' }
  ],
  column: null,
  direction: null,
  handleSort: jest.fn(),
  displayActionsMenu: false
};

const Component = (
  <table>
    <TableHeader { ...props } />
  </table>
);

describe( '<TableHeader />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    const header = wrapper.find( 'TableHeader' );

    expect( header.exists() ).toEqual( true );
    expect( toJSON( header ) ).toMatchSnapshot();
  } );

  it( 'renders the correct table header values', () => {
    const wrapper = mount( Component );
    const th = wrapper.find( 'th' );

    th.forEach( ( t, i ) => {
      expect( t.text() ).toEqual( props.tableHeaders[i].label );
    } );
  } );

  it( 'renders the correct table header class value if displayActionsMenu', () => {
    const newProps = { ...props, ...{ displayActionsMenu: true } };
    const wrapper = mount(
      <table>
        <TableHeader { ...newProps } />
      </table>
    );
    const th = wrapper.find( 'th' );

    th.forEach( t => {
      expect( t.prop( 'className' ) ).toEqual( 'displayActionsMenu' );
    } );
  } );

  it( 'renders the correct table header sorted and direction values if `column === header.name`', () => {
    const newProps = {
      ...props,
      ...{ column: 'createdAt', direction: 'ascending' }
    };
    const wrapper = mount(
      <table>
        <TableHeader { ...newProps } />
      </table>
    );

    const cell = wrapper.find( 'TableHeaderCell' );

    cell.forEach( c => {
      if ( c.prop( 'children' ) === 'CREATED' ) {
        expect( c.prop( 'sorted' ) ).toEqual( newProps.direction );
      } else {
        expect( c.prop( 'sorted' ) ).toEqual( null );
      }
    } );
  } );
} );
