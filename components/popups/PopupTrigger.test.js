import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import PopupTrigger from './PopupTrigger';

const props = {
  toolTip: 'Share Project',
  icon: { img: 'shareIcon.svg', dim: 18 },
  content: <div>content</div>,
  show: true
};

const Component = <PopupTrigger { ...props } />;

const resizeWindow = ( x, y ) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent( new Event( 'resize' ) );
};

describe( '<PopupTrigger />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'sets initial state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();

    expect( inst.state ).toEqual( { isMobile: false } );
  } );

  it( 'componentDidMount calls isMobile', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'isMobile' );

    inst.componentDidMount();
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'isMobile sets isMobile to true in state if window.outerWidth is < 600', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();

    // initial state
    expect( inst.state.isMobile ).toEqual( false );

    window.outerWidth = 500;
    inst.isMobile();
    expect( inst.state.isMobile ).toEqual( true );
  } );

  it( 'isMobile does not set isMobile to true in state if window.outerWidth is > 600', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();

    // initial state
    wrapper.setState( { isMobile: false } );
    expect( inst.state.isMobile ).toEqual( false );

    window.outerWidth = 900;
    inst.isMobile();
    expect( inst.state.isMobile ).toEqual( false );
  } );

  it( 'sets inline display value to none if !props.show', () => {
    const wrapper = mount( Component );
    wrapper.setProps( { show: false } );
    const span = wrapper.find( 'span' );

    expect( span.prop( 'style' ) ).toEqual( { display: 'none' } );
  } );

  it( 'sets correct Popup position and className props', () => {
    const wrapper = mount( Component );
    const popup = () => wrapper.find( 'Popup' );

    expect( wrapper.state( 'isMobile' ) ).toEqual( false );
    expect( popup().prop( 'className' ) ).toEqual( 'popupElem_wrapper' );
    expect( popup().prop( 'position' ) ).toEqual( 'bottom right' );

    wrapper.setState( { isMobile: true } );
    expect( wrapper.state( 'isMobile' ) ).toEqual( true );
    expect( popup().prop( 'className' ) )
      .toEqual( 'popupElem_wrapper popupElem_wrapper--mobile' );
    expect( popup().prop( 'position' ) ).toEqual( 'bottom center' );
  } );
} );
