import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { projects, supportFilesConfig } from 'components/admin/ProjectEdit/mockData';
import ProjectSupportFiles from './ProjectSupportFiles';

const props = {
  heading: 'Support Files',
  projectId: { videoID: 'made-in-america' },
  supportFiles: projects[0].supportFiles,
  hasSubmittedData: false,
  protectImages: true,
  handleChange: jest.fn(),
  config: supportFilesConfig,
  hasUploaded: true
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

  it( 'renders the correct number of `SupportFileTypeList`s', () => {
    const wrapper = shallow( Component );
    const lists = wrapper.find( 'SupportFileTypeList' );
    const typesCount = Object.keys( props.config ).length;
    expect( lists ).toHaveLength( typesCount );
  } );

  it( 'renders a `Checkbox` for protect images if the type is `other`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'Checkbox' ).exists() )
      .toEqual( true );
    wrapper.setProps( {
      config: {
        srt: {
          headline: 'Test Files',
          fileType: 'abc',
          popupMsg: 'A test message'
        }
      }
    } );
    expect( wrapper.find( 'Checkbox' ).exists() )
      .toEqual( false );
  } );

  it( 'checking/unchecking `Checkbox` calls `handleChange`', () => {
    const wrapper = shallow( Component );
    const checkbox = wrapper.find( 'Checkbox' );
    if ( checkbox.exists() ) {
      checkbox.simulate( 'change' );
      expect( props.handleChange ).toHaveBeenCalled();
    }
  } );

  it( 'does not render if no support files', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { supportFiles: {} } );
    expect( wrapper.find( '.support-files' ) )
      .toHaveLength( 0 );
  } );
} );
