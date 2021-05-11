import { mount } from 'enzyme';
import PlaybookTextEditor from './PlaybookTextEditor';

describe( '<PlaybookTextEditor />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <PlaybookTextEditor />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );
