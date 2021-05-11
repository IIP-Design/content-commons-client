import { mount } from 'enzyme';
import PlaybookResources from './PlaybookResources';

describe( '<PlaybookResources />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <PlaybookResources />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );
