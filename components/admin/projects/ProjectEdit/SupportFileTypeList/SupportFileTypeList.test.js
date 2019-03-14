import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { projects, supportFilesConfig } from 'components/admin/projects/ProjectEdit/mockData';
import SupportFileTypeList from './SupportFileTypeList';

const props = {
  headline: supportFilesConfig.srt.headline,
  projectId: { videoID: 'made-in-america' },
  fileType: supportFilesConfig.srt.fileType,
  popupMsg: supportFilesConfig.srt.popupMsg,
  data: projects[0].supportFiles.srt,
  hasSubmittedData: false,
  hasUploaded: false
};

const Component = <SupportFileTypeList { ...props } />;

describe( '<SupportFileTypeList />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders initially `Placeholder` components', () => {
    const wrapper = shallow( Component );
    const placeholders = wrapper.find( 'Placeholder' );
    expect( placeholders ).toHaveLength( props.data.length );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders `SupportItem` components if `hasSubmittedData`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'SupportItem' ) )
      .toHaveLength( 0 );
    wrapper.setProps( { hasSubmittedData: true } );
    expect( wrapper.find( 'SupportItem' ) )
      .toHaveLength( props.data.length );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders `IconPopup` components if `hasSubmittedData`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'IconPopup' ) )
      .toHaveLength( 0 );
    wrapper.setProps( { hasSubmittedData: true } );
    expect( wrapper.find( 'IconPopup' ).exists() )
      .toEqual( true );
    expect( wrapper.find( 'IconPopup' ).prop( 'message' ) )
      .toEqual( props.popupMsg );
  } );

  it( 'renders `EditSupportFiles` components if `hasUploaded`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'EditSupportFiles' ) )
      .toHaveLength( 0 );
    wrapper.setProps( {
      hasSubmittedData: true,
      hasUploaded: true
    } );
    expect( wrapper.find( 'EditSupportFiles' ).exists() )
      .toEqual( true );
  } );

  it( '`SupportItem` components receive correct `projectId` and `itemId`', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { hasSubmittedData: true } );
    const items = wrapper.find( 'SupportItem' );

    expect( items ).toHaveLength( props.data.length );
    items.forEach( ( item, i ) => {
      expect( item.prop( 'projectId' ) )
        .toEqual( props.projectId );
      expect( item.prop( 'itemId' ) )
        .toEqual( props.data[i].id );
    } );
  } );

  it( 'returns null if an empty data array is received', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { data: [] } );
    expect( wrapper.html() ).toEqual( null );
  } );
} );
