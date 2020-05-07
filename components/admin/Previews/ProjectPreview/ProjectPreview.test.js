import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import ProjectPreview from './ProjectPreview';

const Trigger = () => <div className="trigger">Trigger</div>;
const Content = () => <div className="content">Content</div>;

const props = {
  modalTrigger: Trigger,
  modalContent: Content,
  options: {
    one: 'option1',
    two: 'option2'
  }
};

const Component = <ProjectPreview { ...props } />;

describe( '<PreviewProject />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders a Modal component', () => {
    const wrapper = shallow( Component );

    expect( wrapper.name() ).toEqual( 'Modal' );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'receives the Trigger component as prop', () => {
    const wrapper = shallow( Component );

    expect( wrapper.prop( 'trigger' ).type() )
      .toEqual( Trigger() );
  } );

  it( 'receives the options as props', () => {
    const wrapper = shallow( Component );

    expect( wrapper.prop( 'one' ) ).toEqual( 'option1' );
    expect( wrapper.prop( 'two' ) ).toEqual( 'option2' );
  } );

  it( 'receives the Content component as child', () => {
    const wrapper = shallow( Component );
    const content = wrapper.find( 'Content' );

    expect( content.type()() ).toEqual( Content() );
  } );
} );
