import { shallow } from 'enzyme';
import ProjectNotFound from './ProjectNotFound';

describe( '<ProjectNotFound />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( <ProjectNotFound /> );
    const link = wrapper.find( 'Link' );
    const msg = 'The project you’re looking for doesn’t exist.';

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.contains( msg ) ).toEqual( true );
    expect( link.prop( 'href' ) ).toEqual( '/admin/dashboard' );
    expect( link.contains( 'project dashboard' ) ).toEqual( true );
  } );
} );
