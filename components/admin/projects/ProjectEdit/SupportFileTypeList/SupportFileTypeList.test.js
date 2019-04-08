import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { supportFilesConfig } from 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit';
import { getPluralStringOrNot } from 'lib/utils';
import SupportFileTypeList from './SupportFileTypeList';

const props = {
  headline: supportFilesConfig.srt.headline,
  projectId: '123',
  fileType: supportFilesConfig.srt.fileType,
  popupMsg: supportFilesConfig.srt.popupMsg,
  data: [
    { id: 'qwqw' },
    { id: 'erer' },
    { id: 'asas' },
    { id: 'dfdf' }
  ],
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
    const { data: supportFiles, headline } = props;
    const newHeadline = getPluralStringOrNot( supportFiles, headline );
    wrapper.setProps( { headline: newHeadline } );

    expect( wrapper.find( 'Apollo(SupportItem)' ).exists() )
      .toEqual( false );
    expect( wrapper.find( 'Apollo(SupportItem)' ) )
      .toHaveLength( 0 );

    wrapper.setProps( { hasSubmittedData: true } );

    expect( wrapper.find( 'Apollo(SupportItem)' ).exists() )
      .toEqual( true );
    expect( wrapper.find( 'Apollo(SupportItem)' ) )
      .toHaveLength( supportFiles.length );

    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders `IconPopup` components if `hasSubmittedData`', () => {
    const wrapper = shallow( Component );


    expect( wrapper.find( 'IconPopup' ).exists() )
      .toEqual( false );
    expect( wrapper.find( 'IconPopup' ) )
      .toHaveLength( 0 );

    wrapper.setProps( { hasSubmittedData: true } );

    expect( wrapper.find( 'IconPopup' ).exists() )
      .toEqual( true );
    expect( wrapper.find( 'IconPopup' ) )
      .toHaveLength( 1 );
    expect( wrapper.find( 'IconPopup' ).prop( 'message' ) )
      .toEqual( props.popupMsg );
  } );

  it( 'renders `EditSupportFiles` components if `hasUploaded`', () => {
    const wrapper = shallow( Component );

    expect( wrapper.find( 'EditSupportFiles' ).exists() )
      .toEqual( false );
    expect( wrapper.find( 'EditSupportFiles' ) )
      .toHaveLength( 0 );

    wrapper.setProps( {
      hasSubmittedData: true,
      hasUploaded: true
    } );

    expect( wrapper.find( 'EditSupportFiles' ).exists() )
      .toEqual( true );
    expect( wrapper.find( 'EditSupportFiles' ) )
      .toHaveLength( 1 );
  } );

  it( '`SupportItem` components receive correct `projectId` and `itemId`', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { hasSubmittedData: true } );
    const items = wrapper.find( 'Apollo(SupportItem)' );

    expect( items.exists() ).toEqual( true );
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
