import { mount } from 'enzyme';
import AddFilesSectionHeading from './AddFilesSectionHeading';

jest.mock(
  'components/ButtonAddFiles/ButtonAddFiles',
  () => function ButtonAddFiles() { return ''; },
);

const props = {
  projectId: 'project-123',
  title: 'Graphics in Project',
  acceptedFileTypes: 'image/gif, image/jpeg, image/png',
  handleAddFiles: jest.fn(),
};

describe( '<AddFilesSectionHeading />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <AddFilesSectionHeading { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct div wrapper className value if projectId', () => {
    const div = wrapper.find( 'div.add-files-section-heading' );

    expect( div.exists() ).toEqual( true );
    expect( wrapper.prop( 'projectId' ) ).toEqual( props.projectId );
    expect( div.hasClass( 'available' ) ).toEqual( true );
  } );

  it( 'renders the correct div wrapper className value if !projectId', () => {
    wrapper.setProps( { projectId: '' } );
    wrapper.update();
    const div = wrapper.find( 'div.add-files-section-heading' );

    expect( div.exists() ).toEqual( true );
    expect( wrapper.prop( 'projectId' ) ).toEqual( '' );
    expect( div.hasClass( 'unavailable' ) ).toEqual( true );
  } );

  it( 'renders the correct HeadlineElement', () => {
    const heading = wrapper.find( '.headline.uppercase' );

    expect( heading.exists() ).toEqual( true );
    expect( props.el ).toBeUndefined();
    expect( heading.name() ).toEqual( 'h2' );
    expect( heading.contains( props.title ) ).toEqual( true );
  } );

  it( 'renders the ButtonAddFiles', () => {
    const addFilesBtn = wrapper.find( 'ButtonAddFiles' );

    expect( addFilesBtn.exists() ).toEqual( true );
    expect( addFilesBtn.prop( 'accept' ) ).toEqual( props.acceptedFileTypes );
    expect( addFilesBtn.prop( 'multiple' ) ).toEqual( true );
  } );
} );
