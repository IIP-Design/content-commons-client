import { mount } from 'enzyme';
import Filename from './Filename';

const props = {
  children: 'askja-asdfjk-qeowiz-zxwe82-Chinese-(Simplified)_TW.psd',
  filenameLength: 48,
  numCharsBeforeBreak: 24,
  numCharsAfterBreak: 24,
};

describe( '<Filename />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <Filename { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className value', () => {
    const container = wrapper.find( '.filename' );

    expect( container.exists() ).toEqual( true );
  } );

  it( 'renders a focusable wrapper for keyboard accessibility', () => {
    const focusable = wrapper.find( '[tooltip]' );
    const shortName = 'askja-asdfjk-qeowiz-zxwe...nese-(Simplified)_TW.psd';
    const { children: filename, filenameLength } = wrapper.props();

    expect( filename.length ).toBeGreaterThan( filenameLength );
    expect( focusable.exists() ).toEqual( true );
    expect( focusable.props() ).toEqual( {
      tooltip: props.children,
      'aria-hidden': 'true',
      tabIndex: 0,
      children: shortName,
    } );
  } );

  it( 'renders visually hidden text for screen reader accessibility', () => {
    const visuallyHidden = wrapper.find( '.hide-visually' );
    const { children: filename, filenameLength } = wrapper.props();

    expect( filename.length ).toBeGreaterThan( filenameLength );
    expect( visuallyHidden.exists() ).toEqual( true );
    expect( visuallyHidden.text() ).toEqual( props.children );
  } );

  it( 'renders the full filename only if it is shorter than props.filenameLength', () => {
    wrapper.setProps( {
      children: 'short-file-name.jpg',
    } );

    const container = wrapper.find( '.filename' );
    const focusable = wrapper.find( '[tooltip]' );
    const visuallyHidden = wrapper.find( '.hide-visually' );
    const { children: filename, filenameLength } = wrapper.props();

    expect( filename.length ).toBeLessThan( filenameLength );
    expect( focusable.exists() ).toEqual( false );
    expect( visuallyHidden.exists() ).toEqual( false );
    expect( container.contains( filename ) ).toEqual( true );
  } );
} );
