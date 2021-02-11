import { mount } from 'enzyme';
import DynamicConfirm from './DynamicConfirm';

const props = {
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
};

const Component = <DynamicConfirm { ...props } />;

describe( '<DynamicConfirm />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'is closed by default', () => {
    const wrapper = mount( Component );
    const portal = wrapper.find( 'Portal' );

    expect( wrapper.prop( 'open' ) ).toEqual( false );
    expect( portal.prop( 'open' ) ).toEqual( false );
  } );

  it( 'calls onConfirm/onCancel when the Confirm/Cancel button is clicked', () => {
    const wrapper = mount( Component );

    // open the modal
    wrapper.setProps( { open: true } );
    wrapper.update();
    const btns = wrapper.find( 'Button' );

    expect( wrapper.prop( 'open' ) ).toEqual( true );
    btns.forEach( btn => {
      btn.simulate( 'click' );
      if ( btn.prop( 'content' ) === wrapper.prop( 'cancelButton' ) ) {
        expect( props.onCancel ).toHaveBeenCalled();
      } else {
        expect( props.onConfirm ).toHaveBeenCalled();
      }
    } );
  } );
} );
