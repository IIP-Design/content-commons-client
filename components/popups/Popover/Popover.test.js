import { mount } from 'enzyme';
import wait from 'waait';
import Popover from './Popover';

describe( '<Popover />', () => {
  const props = {
    id: 'some-id-123',
    className: 'some-custom-class',
    expandFromRight: true,
    trigger: <p>the trigger</p>,
    children: <p>a child node</p>,
    toolTip: 'the tooltip text',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <Popover { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the container and its className values correctly', () => {
    const container = wrapper.find( '.popover' );

    expect( container.name() ).toEqual( 'span' );
    expect( container.hasClass( props.className ) ).toEqual( true );
  } );

  it( 'renders the button correctly', () => {
    const btn = wrapper.find( 'button' );

    expect( btn.prop( 'id' ) ).toEqual( `popoverButton_${props.id}` );
    expect( btn.prop( 'className' ) ).toEqual( 'popover_trigger' );
    expect( btn.prop( 'type' ) ).toEqual( 'button' );
    expect( btn.prop( 'aria-haspopup' ) ).toEqual( 'true' );
    expect( btn.prop( 'aria-expanded' ) ).toEqual( false );
    expect( btn.prop( 'aria-controls' ) ).toEqual( 'popoverContent' );
    expect( btn.prop( 'tooltip' ) ).toEqual( props.toolTip );
  } );

  it( 'renders the button trigger', () => {
    const btn = wrapper.find( 'button' );
    const btnTrigger = mount( btn.prop( 'children' ) );

    expect( btnTrigger.exists() ).toEqual( true );
    expect( btnTrigger ).toEqual( mount( props.trigger ) );
  } );

  it( 'renders the popover content after clicking the button trigger', () => {
    const { id, children } = props;
    const popoverContentId = `popoverContent_${id}`;
    const btn = () => wrapper.find( 'button' );
    const popoverContent = () => wrapper.find( `[id="${popoverContentId}"]` );

    // initially closed
    expect( btn().prop( 'aria-expanded' ) ).toEqual( false );
    expect( popoverContent().exists() ).toEqual( false );

    // open the popover content
    btn().simulate( 'click' );
    expect( btn().prop( 'aria-expanded' ) ).toEqual( true );
    expect( popoverContent().exists() ).toEqual( true );
    expect( popoverContent().props() ).toEqual( {
      id: popoverContentId,
      className: 'popover_content expandFromRight',
      'aria-labelledby': `popoverButton_${id}`,
      'aria-hidden': false,
      children,
    } );

    // close the popover content
    btn().simulate( 'click' );
    expect( btn().prop( 'aria-expanded' ) ).toEqual( false );
    expect( popoverContent().exists() ).toEqual( false );
  } );
} );
