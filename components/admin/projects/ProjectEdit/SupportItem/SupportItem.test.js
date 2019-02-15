import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { projects, supportFilesConfig } from 'components/admin/projects/ProjectEdit/mockData';
import SupportItem from './SupportItem';

const props = {
  supportItem: projects[0].supportFiles.srt[0],
  projectId: { videoID: 'made-in-america' },
  fileType: supportFilesConfig.srt.fileType,
  itemId: projects[0].supportFiles.srt[0].id
};

const Component = <SupportItem { ...props } />;

describe( '<SupportItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders `Progress` component if `isUploading`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.state( 'isUploading' ) ).toEqual( false );
    expect( wrapper.find( 'Progress' ).exists() )
      .toEqual( wrapper.state( 'isUploading' ) );
    wrapper.setState( { isUploading: true } );
    expect( wrapper.state( 'isUploading' ) )
      .toEqual( wrapper.state( 'isUploading' ) );
    expect( wrapper.find( 'Progress' ).exists() )
      .toEqual( wrapper.state( 'isUploading' ) );
    expect( wrapper.find( 'Progress' ).prop( 'total' ) )
      .toEqual( props.supportItem.size.filesize );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  // it( 'renders error icon and message component if `supportItem` has an error `uploadStatus`', () => {
  //   const wrapper = shallow( Component );

  //   expect( wrapper.find( 'li.support-item.error' ).exists() )
  //     .toEqual( false );
  //   wrapper.setProps( {
  //     supportItem: {
  //       id: '5678',
  //       lang: 'Arabic',
  //       file: 'madeinamerica_arabic.srt',
  //       uploadStatus: {
  //         error: true,
  //         success: false
  //       },
  //       size: { filesize: 24576 }
  //     }
  //   } );
  //   expect( wrapper.find( 'li.support-item.error' ).exists() )
  //     .toEqual( true );
  //   expect( toJSON( wrapper ) ).toMatchSnapshot();
  // } );
} );
