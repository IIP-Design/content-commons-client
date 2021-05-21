import { mount } from 'enzyme';
import TextEditor from './TextEditor';

describe( '<TextEditor />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <TextEditor />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );
