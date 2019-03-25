import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ProjectItem from './ProjectItem';

const Trigger = () => <div className="trigger">Trigger</div>;
const Content = () => <div className="content">Content</div>;
const props = {
  projectId: { videoID: 'made-in-america' },
  itemId: '3728',
  isAvailable: false,
  displayItemInModal: true,
  modalTrigger: Trigger,
  modalContent: Content
};

const Component = <ProjectItem { ...props } />;

describe( '<ProjectItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders initially the Placeholder component', () => {
    const wrapper = shallow( Component );
    expect( wrapper.name() ).toEqual( 'Placeholder' );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders a Modal component if `isAvailable` and `displayItemInModal`', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { isAvailable: true } );
    expect( wrapper.name() ).toEqual( 'Modal' );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'Modal component receives the Trigger component as prop', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { isAvailable: true } );
    expect( wrapper.prop( 'trigger' ).type() )
      .toEqual( Trigger() );
  } );

  it( 'Modal component receives the Content component as child', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { isAvailable: true } );
    const content = wrapper.find( 'Content' );
    expect( content.type()() ).toEqual( Content() );
  } );

  it( 'renders the Trigger component only if `isAvailable` and `!displayItemInModal`', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( {
      isAvailable: true,
      displayItemInModal: false
    } );
    expect( wrapper.type()() ).toEqual( Trigger() );
    expect( wrapper.props() )
      .toEqual( {
        videoID: 'made-in-america',
        itemId: '3728',
        displayItemInModal: false
      } );
  } );
} );
