import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import VideoSupportFilesItem from './VideoSupportFilesItem';

const props = {
  file: {
    id: '82kw',
    filename: 'pdf-1.pdf',
    filetype: 'application/pdf',
    language: {
      id: 'en22',
      displayName: 'English'
    }
  }
};

const Component = <VideoSupportFilesItem { ...props } />;

describe( '<VideoSupportFilesItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.name() ).toEqual( 'li' );
  } );

  it( 'renders the label with language name', () => {
    const wrapper = shallow( Component );
    const label = wrapper.find( 'b.label' );
    const { language: { displayName } } = props.file;

    expect( label.exists() ).toEqual( true );
    expect( label.contains( displayName ) ).toEqual( true );
  } );

  it( 'renders the file name', () => {
    const wrapper = shallow( Component );
    const { filename } = props.file;

    expect( wrapper.contains( filename ) ).toEqual( true );
  } );
} );
