import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import getConfig from 'next/config';
import { projects, units } from 'components/admin/projects/ProjectEdit/mockData';
import VideoEdit from './VideoEdit';

jest.mock( 'next-server/config', () => () => (
  {
    publicRuntimeConfig: {
      REACT_APP_WEBSITE_NAME: process.env.REACT_APP_WEBSITE_NAME,
      REACT_APP_PUBLIC_API: process.env.REACT_APP_PUBLIC_API,
      REACT_APP_APOLLO_ENDPOINT: process.env.REACT_APP_APOLLO_ENDPOINT,
      REACT_APP_GOOGLE_API_KEY: process.env.REACT_APP_GOOGLE_API_KEY,
      REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      REACT_APP_VIMEO_TOKEN: process.env.REACT_APP_VIMEO_TOKEN,
      REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET: process.env.REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET
    }
  }
) );

jest.mock( 'next-server/dynamic', () => () => 'EditSingleProjectItem' );

const TEST_ID = '234';

const Component = <VideoEdit id={ TEST_ID } project={ projects[0] } />;


describe( '<VideoEdit />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    // expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  // it( '`componentDidMount` sets `_isMounted`', () => {
  //   const wrapper = shallow( Component );
  //   const inst = wrapper.instance();
  //   inst.componentDidMount();
  //   expect( inst._isMounted ).toEqual( true );
  // } );

  // it( '`componentWillUnmount` sets `_isMounted` to false', () => {
  //   const wrapper = shallow( Component );
  //   const inst = wrapper.instance();
  //   inst.componentWillUnmount();
  //   expect( inst._isMounted ).toEqual( false );
  // } );


  // it( '`getSupportFilesCount` returns the total number of support files', () => {
  //   const wrapper = shallow( Component );
  //   const inst = wrapper.instance();
  //   const totalFiles = inst.getSupportFilesCount();
  //   // console.log( wrapper.debug() );
  //   // const srtCount = wrapper.prop( 'project' ).supportFiles.srt.length;
  //   // const otherCount = wrapper.prop( 'project' ).supportFiles.other.length;

  //   // expect( totalFiles ).toEqual( srtCount + otherCount );
  // } );

  // it( '`filesToUploadCount` state is set on mount', () => {
  //   const wrapper = shallow( Component );
  //   const inst = wrapper.instance();
  //   // const videosCount = wrapper.prop( 'project' ).videos.length;
  //   const supportFilesCount = inst.getSupportFilesCount();

  //   // expect( wrapper.state( 'filesToUploadCount' ) )
  //   //   .toEqual( videosCount + supportFilesCount );
  // } );

  // it( '`getTags` returns an array of tag values', () => {
  //   const wrapper = shallow( Component );
  //   const inst = wrapper.instance();
  //   // console.log( wrapper.state( 'formData' ) );
  //   // wrapper.setState( {
  //   //   formData: {
  //   //     tags: 'alpha, beta'
  //   //   }
  //   // } );

  //   // console.log( wrapper.instance().getTags() );
  //   // wrapper.instance().getTags();
  //   // expect( wrapper.instance().getTags() )
  //   //   .toEqual( wrapper.state( 'formData' ).tags );
  // } );
} );
