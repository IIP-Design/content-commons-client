import { mount } from 'enzyme';
import ModalTranscript from './ModalTranscript';

describe( '<ModalTranscript />', () => {
  const props = {
    transcript: 'the transcript text',
    classes: 'class-value-1 class-value-2',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalTranscript { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className values', () => {
    const container = wrapper.find( 'div' ).at( 0 );

    expect( container.hasClass( props.classes ) ).toEqual( true );
  } );

  it( 'renders the transcript label', () => {
    const label = wrapper.find( '.transcript_label' );

    expect( label.text() ).toEqual( 'Transcript:' );
    expect( label.name() ).toEqual( 'p' );
  } );

  it( 'renders the transcript text', () => {
    const txt = wrapper.find( '.transcript_text' );

    expect( txt.text() ).toEqual( props.transcript );
    expect( txt.name() ).toEqual( 'div' );
  } );
} );
