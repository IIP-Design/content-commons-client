import { mount } from 'enzyme';
import IncludeRequiredFileMsg from './IncludeRequiredFileMsg';

describe( '<IncludeRequiredFileMsg />', () => {
  const props = {
    msg: 'Please include at least one graphic file.',
    includeRequiredFileMsg: false,
    setIncludeRequiredFileMsg: jest.fn(),
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <IncludeRequiredFileMsg { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders with the correct className', () => {
    const modal = wrapper.find( 'Modal' );

    expect( modal.prop( 'className' ) ).toEqual( 'includeRequiredFileMsg' );
  } );

  it( 'onClose calls setIncludeRequiredFileMsg', () => {
    const modal = wrapper.find( 'Modal' );
    const { onClose } = modal.props();

    onClose();
    expect( props.setIncludeRequiredFileMsg ).toHaveBeenCalledWith( false );
  } );
} );
