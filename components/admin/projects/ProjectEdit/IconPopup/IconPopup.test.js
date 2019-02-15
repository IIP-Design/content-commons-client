import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import IconPopup from './IconPopup';

const Component = <IconPopup message="A test message" iconType="info circle" size="tiny" />;

const newProps = {
  message: 'An updated test message',
  iconType: 'undo',
  size: 'huge'
};

describe( '<IconPopup />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'receives props', () => {
    const wrapper = shallow( Component );
    expect( wrapper.prop( 'content' ) ).toEqual( 'A test message' );
    expect( wrapper.prop( 'size' ) ).toEqual( 'tiny' );
  } );

  it( 'sets new props', () => {
    const wrapper = shallow( Component );
    const { message, iconType, size } = newProps;
    wrapper.setProps( { message, iconType, size } );
    expect( wrapper.prop( 'content' ) ).toEqual( message );
    expect( wrapper.prop( 'size' ) ).toEqual( size );
  } );
} );
