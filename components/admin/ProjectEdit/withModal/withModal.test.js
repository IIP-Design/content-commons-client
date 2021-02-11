import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import withModal from './withModal';

const props = {
  triggerProps: {
    one: 'prop1',
    two: 'prop2',
  },
  contentProps: {
    one: 'prop3',
    two: 'prop4',
  },
};
const Trigger = () => <div className="trigger">Modal Trigger</div>;
const Content = () => <div className="content">Modal Content</div>;
const options = {
  one: 'option1',
  two: 'option2',
};
const Component = withModal( props, Trigger, Content, options );

describe( 'withModal()', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders the Trigger component', () => {
    const wrapper = shallow( Component );
    const trigger = wrapper.prop( 'trigger' );

    expect( trigger.type() ).toEqual( Trigger() );
    expect( trigger.props )
      .toEqual( { one: 'prop1', two: 'prop2' } );
  } );

  it( 'passes option props to Trigger element', () => {
    const wrapper = shallow( Component );
    const triggerEl = wrapper.find( '.ui.modal' );

    expect( triggerEl.prop( 'one' ) )
      .toEqual( 'option1' );
    expect( triggerEl.prop( 'two' ) )
      .toEqual( 'option2' );
  } );

  it( 'renders Content component', () => {
    const wrapper = shallow( Component );
    const content = wrapper.find( 'Content' );

    expect( content.equals( <Content one="prop3" two="prop4" /> ) )
      .toEqual( true );
  } );
} );
