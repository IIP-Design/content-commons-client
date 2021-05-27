import { mount } from 'enzyme';
import TextEditor from './TextEditor';

jest.mock(
  'lib/hooks/useCKEditor',
  () => jest.fn( () => ( {
    isEditorLoaded: true,
    CKEditor: () => '',
    Editor: () => '',
  } ) ),
);

describe( '<TextEditor />', () => {
  let Component;
  let wrapper;

  const props = {
    id: 'playbook123',
    content: {
      id: 'contentId123',
      rawText: '',
      html: '<p>test content</p>',
      markdown: '',
    },
    type: 'PLAYBOOK',
    updateMutation: jest.fn(),
  };

  beforeEach( () => {
    Component = <TextEditor { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders an accessible region label', () => {
    const section = wrapper.find( 'section[aria-label="Body"]' );

    expect( section.exists() ).toEqual( true );
  } );

  it( 'renders a region heading', () => {
    const section = wrapper.find( 'section[aria-label="Body"]' );
    const heading = section.find( 'h2' );

    expect( heading.contains( 'Body' ) ).toEqual( true );
  } );

  it( 'renders the CKEditor', () => {
    const editor = wrapper.find( 'CKEditor' );

    expect( editor.exists() ).toEqual( true );
  } );
} );
