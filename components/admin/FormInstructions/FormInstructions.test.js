import { shallow } from 'enzyme';
import FormInstructions from './FormInstructions';

const Component = <FormInstructions />;

describe( '<FormInstructions />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders paragraphs', () => {
    const wrapper = shallow( Component );

    expect( wrapper.children() ).toHaveLength( 2 );
    wrapper.children().forEach( node => {
      expect( node.name() ).toEqual( 'p' );
    } );
  } );

  it( 'renders base styles', () => {
    const wrapper = shallow( Component );
    const baseMsg = wrapper.childAt( 0 );

    expect( baseMsg.prop( 'style' ) ).toEqual( {
      margin: '0',
      padding: '0.625em 1.75em',
      backgroundColor: '#d6d7d9',
      textAlign: 'center',
    } );
  } );

  it( 'renders instructions to complete the form', () => {
    const wrapper = shallow( Component );
    const baseMsg = wrapper.childAt( 0 );

    expect( baseMsg.text() ).toEqual( 'Fill out the required fields to finish setting up this project.' );
  } );

  it( 'renders instructions to complete the form if props.type is passed', () => {
    const wrapper = shallow( Component );

    wrapper.setProps( { type: 'package' } );
    const baseMsg = wrapper.childAt( 0 );

    expect( baseMsg.text() ).toEqual( 'Fill out the required fields to finish setting up this package.' );
  } );

  it( 'renders draft message styles', () => {
    const wrapper = shallow( Component );
    const draftMsg = wrapper.childAt( 1 );

    expect( draftMsg.prop( 'style' ) ).toEqual( {
      margin: '0',
      padding: '0.625em 1.75em 1.5em',
      backgroundColor: '#fff',
      textAlign: 'center',
    } );
  } );

  it( 'renders a draft message', () => {
    const wrapper = shallow( Component );
    const draftMsg = wrapper.childAt( 1 );

    expect( draftMsg.text() ).toEqual( 'Your files will not be uploaded until the project is saved as a draft.' );
  } );

  it( 'renders a draft message if props.type is passed', () => {
    const wrapper = shallow( Component );

    wrapper.setProps( { type: 'package' } );
    const draftMsg = wrapper.childAt( 1 );

    expect( draftMsg.text() ).toEqual( 'Your files will not be uploaded until the package is saved as a draft.' );
  } );
} );
