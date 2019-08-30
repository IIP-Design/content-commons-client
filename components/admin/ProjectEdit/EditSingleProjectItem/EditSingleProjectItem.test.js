import { shallow } from 'enzyme';
import EditSingleProjectItem from './EditSingleProjectItem';

const Component = <EditSingleProjectItem />;

describe( '<EditSingleProjectItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders children', () => {
    const wrapper = shallow( Component );
    expect( wrapper.children()
      .equals( <p>Edit Single Project Item Component</p> ) )
      .toEqual( true );
  } );
} );
