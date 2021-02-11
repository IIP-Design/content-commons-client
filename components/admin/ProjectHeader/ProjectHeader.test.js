import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Button } from 'semantic-ui-react';
import ProjectHeader from './ProjectHeader';

const Component = (
  <ProjectHeader text="Test Heading" icon="video">
    <Button content="Button 1" />
    <Button content="Button 2" />
  </ProjectHeader>
);

describe( '<ProjectHeader />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders children', () => {
    const wrapper = shallow( Component );

    expect( wrapper.children() ).toHaveLength( 2 );
  } );

  it( 'renders buttons', () => {
    const wrapper = shallow( Component );
    const buttons = wrapper.find( '.project_buttons' );

    expect( buttons.children() ).toHaveLength( 2 );
    buttons.children().forEach( node => {
      expect( node.name() ).toEqual( 'Button' );
    } );
  } );
} );
