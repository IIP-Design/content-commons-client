import { shallow } from 'enzyme';
import NotFound404 from './NotFound404';

describe( '<NotFound404 />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( <NotFound404 /> );
    const msg1 = 'We are unable to find the page you are looking for.';
    const msg2 = 'Visit the Content Commons at commons.america.gov to search for PD content.';

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.contains( msg1 ) ).toEqual( true );
    expect( wrapper.contains( msg2 ) ).toEqual( true );
  } );
} );
