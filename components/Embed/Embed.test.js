import { mount } from 'enzyme';
import ClipboardCopy from '../ClipboardCopy';
import Embed from '.';

const props = {
  instructions: 'the embed instructions',
  children: [
    <div key="1" className="some-child one">first child component</div>,
    <div key="2" className="some-child two">second child component</div>,
  ],
  embedItem: '<iframe src="https://the-source-url.com/99999" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
  isPreview: false,
};

const Component = <Embed { ...props } />;

describe( '<Embed />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the instructions', () => {
    const wrapper = mount( Component );
    const instructions = wrapper.find( 'div.form-group_instructions' );

    expect( instructions.exists() ).toEqual( true );
    expect( instructions.text() ).toEqual( props.instructions );
  } );

  it( 'renders the ClipboardCopy component', () => {
    const wrapper = mount( Component );
    const clipboardCopy = wrapper.find( ClipboardCopy );

    expect( clipboardCopy.exists() ).toEqual( true );
  } );

  it( 'renders an enabled input element with the embed code if !isPreview', () => {
    const wrapper = mount( Component );
    const input = wrapper.find( 'input[type="text"]' );

    expect( input.exists() ).toEqual( true );
    expect( input.prop( 'defaultValue' ) ).toEqual( props.embedItem );
    expect( input.prop( 'disabled' ) ).toEqual( props.isPreview );
  } );

  it( 'renders a disabled input element with placeholder text if isPreview', () => {
    const wrapper = mount( Component );

    wrapper.setProps( {
      isPreview: true,
      embedItem: 'The video embed code will appear here.',
    } );
    const input = wrapper.find( 'input[type="text"]' );

    expect( wrapper.prop( 'isPreview' ) ).toEqual( true );
    expect( input.exists() ).toEqual( true );
    expect( input.prop( 'disabled' ) ).toEqual( wrapper.prop( 'isPreview' ) );
    expect( input.prop( 'defaultValue' ) )
      .toEqual( wrapper.prop( 'embedItem' ) );
  } );

  it( 'renders an enabled copy Button', () => {
    const wrapper = mount( Component );
    const copyBtn = wrapper.find( 'Button' );

    expect( copyBtn.exists() ).toEqual( true );
    expect( copyBtn.prop( 'disabled' ) ).toEqual( props.isPreview );
  } );

  it( 'renders a disabled copy Button if isPreview', () => {
    const wrapper = mount( Component );

    wrapper.setProps( { isPreview: true } );
    const copyBtn = wrapper.find( 'Button' );

    expect( wrapper.prop( 'isPreview' ) ).toEqual( true );
    expect( copyBtn.exists() ).toEqual( true );
    expect( copyBtn.prop( 'disabled' ) ).toEqual( wrapper.prop( 'isPreview' ) );
  } );

  it( 'renders children', () => {
    const wrapper = mount( Component );
    const childOne = wrapper.find( '.some-child.one' );
    const childTwo = wrapper.find( '.some-child.two' );

    expect( childOne.exists() ).toEqual( true );
    expect( childOne.text() ).toEqual( 'first child component' );
    expect( childTwo.exists() ).toEqual( true );
    expect( childTwo.text() ).toEqual( 'second child component' );
  } );
} );
