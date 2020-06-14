import { mount } from 'enzyme';
import ModalContentMeta from './ModalContentMeta';

jest.mock(
  '../ModalTranscript/ModalTranscript',
  () => function ModalTranscript() { return ''; },
);

describe( '<ModalContentMeta />', () => {
  const props = {
    type: 'social media graphic',
    dateUpdated: '2020-06-05T19:14:45.681Z',
    transcript: 'some transcript text',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalContentMeta { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct section className values', () => {
    const container = wrapper.find( 'section' );
    const values = 'modal_section modal_section--metaContent';

    expect( container.hasClass( values ) ).toEqual( true );
  } );

  it( 'renders the meta_wrapper', () => {
    const metaWrapper = wrapper.find( '.modal_meta_wrapper' );

    expect( metaWrapper.exists() ).toEqual( true );
  } );

  it( 'renders the modal_meta', () => {
    const meta = wrapper.find( '.modal_meta' );
    const { children } = meta.props();
    const nodeData = [
      {
        className: 'modal_meta_content modal_meta_content--filetype',
        name: 'span',
        content: `File Type: ${props.type}`,
      },
      {
        className: 'modal_meta_content modal_meta_content--date',
        name: 'span',
        content: 'Updated: June 05, 2020',
      },
    ];

    children.forEach( ( node, i ) => {
      const { className, name, content } = nodeData[i];

      expect( node.type ).toEqual( name );
      expect( node.props.className ).toEqual( className );
      expect( node.props.children ).toEqual( content );
    } );
  } );

  it( 'renders the modal_transcript & ModalTranscript', () => {
    const transcript = () => wrapper.find( '.modal_transcript' );
    const btn = () => transcript().find( 'button' );
    const icon = () => transcript().find( 'Icon' );
    const modalTranscript = () => wrapper.find( 'ModalTranscript' );

    // closed initially
    expect( btn().hasClass( 'ui button' ) ).toEqual( true );
    expect( btn().prop( 'type' ) ).toEqual( 'button' );
    expect( btn().text() ).toEqual( 'Transcript' );
    expect( icon().prop( 'name' ) ).toEqual( 'chevron down' );
    expect( modalTranscript().props() ).toEqual( {
      transcript: props.transcript,
      classes: 'transcript',
    } );

    // open the transcript
    btn().simulate( 'click' );
    expect( btn().hasClass( 'ui button transcriptDisplay' ) ).toEqual( true );
    expect( icon().prop( 'name' ) ).toEqual( 'chevron up' );
    expect( modalTranscript().props() ).toEqual( {
      transcript: props.transcript,
      classes: 'transcript active',
    } );
  } );
} );

describe( '<ModalContentMeta />, if there is no props.transcript', () => {
  const props = {
    type: 'social media graphic',
    dateUpdated: '2020-06-05T19:14:45.681Z',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalContentMeta { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct section className values', () => {
    const container = wrapper.find( 'section' );
    const values = 'modal_section modal_section--metaContent';

    expect( container.hasClass( values ) ).toEqual( true );
  } );

  it( 'renders the meta_wrapper', () => {
    const metaWrapper = wrapper.find( '.modal_meta_wrapper' );

    expect( metaWrapper.exists() ).toEqual( true );
  } );

  it( 'renders the modal_meta', () => {
    const meta = wrapper.find( '.modal_meta' );
    const { children } = meta.props();
    const nodeData = [
      {
        className: 'modal_meta_content modal_meta_content--filetype',
        name: 'span',
        content: `File Type: ${props.type}`,
      },
      {
        className: 'modal_meta_content modal_meta_content--date',
        name: 'span',
        content: 'Updated: June 05, 2020',
      },
    ];

    children.forEach( ( node, i ) => {
      const { className, name, content } = nodeData[i];

      expect( node.type ).toEqual( name );
      expect( node.props.className ).toEqual( className );
      expect( node.props.children ).toEqual( content );
    } );
  } );

  it( 'does not render the modal_transcript & ModalTranscript', () => {
    const transcript = wrapper.find( '.modal_transcript' );
    const modalTranscript = wrapper.find( 'ModalTranscript' );

    expect( transcript.exists() ).toEqual( false );
    expect( modalTranscript.exists() ).toEqual( false );
  } );
} );
