import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { projects } from 'components/admin/ProjectEdit/mockData';
import VideoEdit from './VideoEdit';
// import { VideoEdit } from './VideoEdit';

jest.mock( 'next-server/config', () => () => (
  {
    publicRuntimeConfig: {
      REACT_APP_WEBSITE_NAME: process.env.REACT_APP_WEBSITE_NAME,
      REACT_APP_PUBLIC_API: process.env.REACT_APP_PUBLIC_API,
      REACT_APP_APOLLO_ENDPOINT: process.env.REACT_APP_APOLLO_ENDPOINT,
      REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      REACT_APP_VIMEO_TOKEN: process.env.REACT_APP_VIMEO_TOKEN,
      REACT_APP_AWS_S3_AUTHORING_BUCKET: process.env.REACT_APP_AWS_S3_AUTHORING_BUCKET
    }
  }
) );

jest.mock( 'next-server/dynamic', () => () => 'EditSingleProjectItem' );

const TEST_ID = '234';

const props = {
  id: TEST_ID,
  data: projects[0],
  updateVideoProject: () => {},
  deleteVideoProject: () => {},
  router: Router,
  setIsUploading: () => {},
  uploadExecute: () => {},
  uploadReset: () => {},
  uploadProgress: () => {},
  upload: {}
};

// const Component = <VideoEdit id={ TEST_ID } project={ projects[0] } />;
const Component = <VideoEdit { ...props } />;

describe( '<VideoEdit />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  // it( 'displays the `include Video File` notification if disableBtns is true', () => {
  //   const wrapper = mount( Component );
  //   expect( wrapper.find( '.addVideoFileNotification' ).length ).toBe( 0);
  //   wrapper.setState( { disableBtns: true } );
  //   expect( wrapper.find( '.addVideoFileNotification' ).length ).toBe( 1 );
  // } );

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
