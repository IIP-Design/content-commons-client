import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ClipboardCopy from './index';

const props = {
  copyItem: 'the item to be copied',
  isPreview: false,
  label: 'Direct Link'
};

const Component = <ClipboardCopy { ...props } />;

describe( '<ClipboardCopy />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'sets initial state', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();

    expect( inst.state ).toEqual( { label: 'Copy', cls: '' } );
  } );

  it( 'sets timeoutID as null initially', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();

    expect( inst.timeoutID ).toEqual( null );
  } );

  it( 'componentWillUnmount calls clearTimeout', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    window.clearTimeout = jest.fn();

    inst.componentWillUnmount();
    expect( window.clearTimeout ).toHaveBeenCalledWith( inst.timeoutID );
  } );

  it( 'handleCopyClick calls toggleCls and execCommand and selects copyInput', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const toggleClsSpy = jest.spyOn( inst, 'toggleCls' );
    const copyInputSpy = jest.spyOn( inst.copyInput, 'select' );
    document.execCommand = jest.fn();

    inst.handleCopyClick();
    expect( toggleClsSpy ).toHaveBeenCalledWith( '✓ Copied', 'copied' );
    expect( document.execCommand ).toHaveBeenCalledWith( 'copy' );
    expect( copyInputSpy ).toHaveBeenCalled();
    expect( inst.timeoutID ).toBeTruthy();
  } );

  it( 'handleFocus selects e.target', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const e = { target: { select: jest.fn() } };
    const spy = jest.spyOn( e.target, 'select' );

    inst.handleFocus( e );
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'toggleCls sets state for label and cls', () => {
    const wrapper = mount( Component );
    const inst = wrapper.instance();
    const newState = { label: 'new label', cls: 'new class' };

    inst.toggleCls( newState.label, newState.cls );
    expect( inst.state ).toEqual( newState );
  } );

  it( 'clicking the Button calls handleCopyClick', () => {
    const wrapper = mount( Component );
    const button = wrapper.find( 'Button' );
    const inst = wrapper.instance();
    const toggleClsSpy = jest.spyOn( inst, 'toggleCls' );
    const copyInputSpy = jest.spyOn( inst.copyInput, 'select' );
    document.execCommand = jest.fn();

    button.simulate( 'click' );
    expect( toggleClsSpy ).toHaveBeenCalled();
    expect( copyInputSpy ).toHaveBeenCalled();
    expect( document.execCommand ).toHaveBeenCalled();
    expect( inst.timeoutID ).toBeTruthy();
  } );

  it( 'focusing the input calls handleFocus', () => {
    const wrapper = mount( Component );
    const input = wrapper.find( 'input.clipboardcopy_item_text' );
    const e = { target: { select: jest.fn() } };
    const copyInputSpy = jest.spyOn( e.target, 'select' );

    input.simulate( 'focus', e );
    expect( copyInputSpy ).toHaveBeenCalled();
  } );

  it( 'disables the input and button if isPreview is true', () => {
    const wrapper = mount( Component );
    wrapper.setProps( { isPreview: true } );
    const button = wrapper.find( 'Button' );
    const input = wrapper.find( 'input.clipboardcopy_item_text' );
    const { isPreview } = wrapper.props();

    expect( input.prop( 'disabled' ) ).toEqual( isPreview );
    expect( button.prop( 'disabled' ) ).toEqual( isPreview );
  } );
} );
