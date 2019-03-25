import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import IconPopup from './IconPopup';

const props = {
  message: 'A test message',
  iconType: 'info circle',
  iconSize: 'tiny',
  popupSize: 'mini'
};

const newProps = {
  message: 'An updated test message',
  iconType: 'undo',
  iconSize: 'huge',
  popupSize: 'large'
};

const Component = <IconPopup { ...props } />;

describe( '<IconPopup />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'receives props', () => {
    const wrapper = shallow( Component );
    const { message, popupSize } = props;
    expect( wrapper.prop( 'content' ) ).toEqual( message );
    expect( wrapper.prop( 'size' ) ).toEqual( popupSize );
  } );

  it( 'sets new props', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { ...newProps } );
    expect( wrapper.prop( 'content' ) )
      .toEqual( newProps.message );
    expect( wrapper.prop( 'size' ) )
      .toEqual( newProps.popupSize );
  } );
} );
