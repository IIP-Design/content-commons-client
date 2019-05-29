import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import TableSearch from './TableSearch';

const props = { handleSearchSubmit: jest.fn() };

const Component = <TableSearch { ...props } />;

describe( '<TableSearch />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'submitting search Form calls handleSearchSubmit', () => {
    const wrapper = shallow( Component );
    const form = wrapper.find( 'Form' );

    form.simulate( 'submit' );
    expect( props.handleSearchSubmit ).toHaveBeenCalled();
  } );
} );
