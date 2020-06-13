import { shallow } from 'enzyme';
import EditSingleProjectItem from './EditSingleProjectItem';

jest.mock( 'next/dynamic', () => 'dynamically-imported-component' );

const Component = <EditSingleProjectItem />;

describe.skip( '<EditSingleProjectItem />', () => {
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
