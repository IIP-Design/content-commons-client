import { shallow } from 'enzyme';
import ConfirmModalContent from './ConfirmModalContent';

const Content = () => <div className="content">Content</div>;
const props = {
  children: <Content />,
  className: 'Test Class Name',
  headline: 'Test Headline',
};

const Component = <ConfirmModalContent { ...props } />;

describe( '<ConfirmModalContent />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders a `div`', () => {
    const wrapper = shallow( Component );
    expect( wrapper.name() ).toEqual( 'div' );
  } );

  it( 'has "Test Class Name" class value', () => {
    const wrapper = shallow( Component );
    expect( wrapper.hasClass( 'Test Class Name' ) )
      .toEqual( true );
  } );

  it( 'receives the default style prop', () => {
    const wrapper = shallow( Component );
    expect( wrapper.prop( 'style' ) ).toEqual( {} );
  } );

  it( 'receives custom style prop', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { style: { fontSize: '2rem' } } );
    expect( wrapper.prop( 'style' ) )
      .toEqual( { fontSize: '2rem' } );
  } );

  it( 'renders the headline', () => {
    const wrapper = shallow( Component );
    const heading = wrapper.childAt( 0 );
    expect( heading.name() ).toEqual( 'h2' );
    expect( heading.text() ).toEqual( 'Test Headline' );
  } );

  it( 'renders the child Content', () => {
    const wrapper = shallow( Component );
    const content = wrapper.find( 'Content' );
    expect( content.type()() ).toEqual( Content() );
  } );
} );
