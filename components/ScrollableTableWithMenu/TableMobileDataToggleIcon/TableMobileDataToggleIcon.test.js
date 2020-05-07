import { shallow } from 'enzyme';
import TableMobileDataToggleIcon from './TableMobileDataToggleIcon';

const props = {
  isOpen: false,
  toggleDisplay: jest.fn(),
};

const Component = <TableMobileDataToggleIcon { ...props } />;

describe( '<TableMobileDataToggleIcon />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct Icon name', () => {
    const wrapper = shallow( Component );

    expect( wrapper.prop( 'name' ) ).toEqual( 'chevron down' );
    wrapper.setProps( { isOpen: true } );

    expect( wrapper.prop( 'name' ) ).toEqual( 'chevron up' );
  } );

  it( 'clicking the Icon calls toggleDisplay', () => {
    const wrapper = shallow( Component );

    wrapper.simulate( 'click' );
    expect( props.toggleDisplay ).toHaveBeenCalledTimes( 1 );
  } );
} );
