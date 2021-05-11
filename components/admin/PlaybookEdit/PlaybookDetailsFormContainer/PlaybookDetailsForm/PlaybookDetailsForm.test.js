import { mount } from 'enzyme';
import PlaybookDetailsForm from './PlaybookDetailsForm';

describe( '<PlaybookDetailsForm />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <PlaybookDetailsForm />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );
