import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { config } from './VideoProjectSupportFiles/config';
import ProjectSupportFiles from './ProjectSupportFiles';

jest.mock(
  './SupportFileTypeList/SupportFileTypeList',
  () => function SupportFileTypeList() {
    return '<SupportFileTypeList />';
  }
);

const props = {
  heading: 'Support Files',
  projectId: '123',
  save: jest.fn(),
  config: config.supportFiles
};

const Component = <ProjectSupportFiles { ...props } />;

describe( '<ProjectSupportFiles />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders the heading', () => {
    const wrapper = shallow( Component );
    const heading = wrapper.find( '.heading' );
    expect( heading.name() ).toEqual( 'h2' );
    expect( heading.text() ).toEqual( props.heading );
  } );

  it( 'renders the correct number of <SupportFileTypeList /> components', () => {
    const wrapper = shallow( Component );
    const lists = wrapper.find( 'SupportFileTypeList' );
    const typesCount = Object.keys( props.config.types ).length;
    expect( lists ).toHaveLength( typesCount );
  } );
} );
