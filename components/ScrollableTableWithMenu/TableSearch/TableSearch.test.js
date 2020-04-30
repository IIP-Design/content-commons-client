import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import TableSearch from './TableSearch';

const props = { handleSearchSubmit: jest.fn() };

describe( '<TableSearch />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( <TableSearch { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders shows the close button when appropriate', () => {
    const wrapper = shallow( <TableSearch { ...props } /> );

    const input = wrapper.find( 'Input' );

    // Initially no clear button shown
    expect( wrapper.find( '.clear' ) ).toHaveLength( 0 );

    input.simulate( 'change', { e: {} }, { value: 'test' } );

    // Once input value present, clear button appears
    expect( wrapper.find( '.clear' ) ).toHaveLength( 1 );
  } );

  it( 'submitting search Form calls handleSearchSubmit', () => {
    const wrapper = shallow( <TableSearch { ...props } /> );

    const form = wrapper.find( 'Form' );

    form.simulate( 'submit' );

    expect( props.handleSearchSubmit ).toHaveBeenCalledTimes( 1 );
  } );
} );
