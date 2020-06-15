import { mount } from 'enzyme';
import wait from 'waait';
import { getFileExt } from 'lib/utils';
import { SupportFileTypeList } from './SupportFileTypeList';
import {
  data, filesToUpload, srtProps, otherProps,
} from './mocks';

jest.mock( 'components/popups/IconPopup/IconPopup', () => 'icon-popup' );
jest.mock( '../SupportItem/SupportItem', () => 'support-item' );
jest.mock( '../../ProjectEdit/EditProjectFilesModal/EditProjectFilesModal', () => 'edit-project-files-modal' );

/**
 * Use components unconnected from Redux to simplify
 * testing and avoid setup of mock Redux `store`. Best to
 * test Redux actions and reducers in isolation elsewhere.
 *
 * However, this affects the use of Apollo MockProvider
 * since the Redux `connect` is wrapped inside the Apollo
 * `Provider`, i.e., if no mock Redux store, then no Apollo
 * `MockProvider`.
 *
 * @see https://redux.js.org/recipes/writing-tests#connected-components
 * @see https://hackernoon.com/unit-testing-redux-connected-components-692fa3c4441c
 */
const SrtFilesComponent = <SupportFileTypeList { ...srtProps } />;
const OtherFilesComponent = <SupportFileTypeList { ...otherProps } />;

describe( '<SupportFileTypeList /> for a new project', () => {
  const getFilesForNewProject = props => {
    const { config: { types }, type } = props;
    const { extensions } = types[type];

    return filesToUpload.filter( file => extensions.includes( getFileExt( file.input.name ) ) );
  };

  it.skip( 'renders for SRTs without crashing', async () => {
    const wrapper = mount( SrtFilesComponent );

    wrapper.setProps( {
      ...srtProps,
      ...{ data: {}, filesToUpload: [] },
    } );
    await wait( 0 );
    wrapper.update();

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders for Other files without crashing', async () => {
    const wrapper = mount( OtherFilesComponent );

    wrapper.setProps( {
      ...otherProps,
      ...{ data: {}, filesToUpload: [] },
    } );
    await wait( 0 );
    wrapper.update();

    expect( wrapper.exists() ).toEqual( true );
  } );

  it.skip( 'renders IconPopup with correct SRT files message', async () => {
    const wrapper = mount( SrtFilesComponent );
    const iconPopup = wrapper.find( 'IconPopup' );
    const { type } = srtProps;
    const { popupMsg } = srtProps.config.types[type];

    wrapper.setProps( {
      ...srtProps,
      ...{ data: {}, filesToUpload },
    } );
    await wait( 0 );
    wrapper.update();

    expect( iconPopup.exists() ).toEqual( true );
    expect( iconPopup.prop( 'message' ) ).toEqual( popupMsg );
  } );

  it.skip( 'renders IconPopup with correct Other files message', async () => {
    const wrapper = mount( OtherFilesComponent );
    const iconPopup = wrapper.find( 'IconPopup' );
    const { type } = otherProps;
    const { popupMsg } = otherProps.config.types[type];

    wrapper.setProps( {
      ...otherProps,
      ...{ data: {}, filesToUpload },
    } );
    await wait( 0 );
    wrapper.update();

    expect( iconPopup.exists() ).toEqual( true );
    expect( iconPopup.prop( 'message' ) ).toEqual( popupMsg );
  } );

  it.skip( 'renders EditSupportFiles with correct SRT files', async () => {
    const wrapper = mount( SrtFilesComponent );

    wrapper.setProps( {
      ...srtProps,
      ...{ data: {}, filesToUpload },
    } );
    await wait( 0 );
    wrapper.update();

    const editSupportFiles = wrapper.find( 'EditSupportFiles' );
    const srts = getFilesForNewProject( srtProps );

    expect( wrapper.prop( 'projectId' ) ).toEqual( srtProps.projectId );
    expect( editSupportFiles.exists() ).toEqual( true );
    expect( editSupportFiles.prop( 'supportFiles' ) ).toEqual( srts );
  } );

  it.skip( 'renders EditSupportFiles with correct Other files', async () => {
    const wrapper = mount( OtherFilesComponent );

    wrapper.setProps( {
      ...otherProps,
      ...{ data: {}, filesToUpload },
    } );
    await wait( 0 );
    wrapper.update();

    const editSupportFiles = wrapper.find( 'EditSupportFiles' );
    const otherFiles = getFilesForNewProject( otherProps );

    expect( wrapper.prop( 'projectId' ) ).toEqual( srtProps.projectId );
    expect( editSupportFiles.exists() ).toEqual( true );
    expect( editSupportFiles.prop( 'supportFiles' ) ).toEqual( otherFiles );
  } );

  it.skip( 'renders the correct SupportItem components for SRTs', async () => {
    const wrapper = mount( SrtFilesComponent );

    wrapper.setProps( {
      ...srtProps,
      ...{ data: {}, filesToUpload },
    } );
    await wait( 0 );
    wrapper.update();

    const supportItems = wrapper.find( 'SupportItem' );
    const srts = getFilesForNewProject( srtProps );

    expect( supportItems.length ).toEqual( srts.length );
    supportItems.forEach( ( supportItem, i ) => {
      expect( supportItem.prop( 'item' ) ).toEqual( srts[i] );
    } );
  } );

  it.skip( 'renders the correct SupportItem components for Other files', async () => {
    const wrapper = mount( OtherFilesComponent );

    wrapper.setProps( {
      ...otherProps,
      ...{ data: {}, filesToUpload },
    } );
    await wait( 0 );
    wrapper.update();

    const supportItems = wrapper.find( 'SupportItem' );
    const otherFiles = getFilesForNewProject( otherProps );

    expect( supportItems.length ).toEqual( otherFiles.length );
    supportItems.forEach( ( supportItem, i ) => {
      expect( supportItem.prop( 'item' ) ).toEqual( otherFiles[i] );
    } );
  } );
} );

describe( '<SupportFileTypeList /> for an existing project', () => {
  it.skip( 'renders for SRTs without crashing', async () => {
    const wrapper = mount( SrtFilesComponent );

    wrapper.setProps( { ...srtProps, data } );
    await wait( 0 );
    wrapper.update();

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders for Other files without crashing', async () => {
    const wrapper = mount( OtherFilesComponent );

    wrapper.setProps( { ...otherProps, data } );
    await wait( 0 );
    wrapper.update();

    expect( wrapper.exists() ).toEqual( true );
  } );

  it.skip( 'renders IconPopup with correct SRT files message', async () => {
    const wrapper = mount( SrtFilesComponent );
    const iconPopup = wrapper.find( 'IconPopup' );
    const { type } = srtProps;
    const { popupMsg } = srtProps.config.types[type];

    wrapper.setProps( { ...srtProps, data } );
    await wait( 0 );
    wrapper.update();

    expect( iconPopup.exists() ).toEqual( true );
    expect( iconPopup.prop( 'message' ) ).toEqual( popupMsg );
  } );

  it.skip( 'renders IconPopup with correct Other files message', async () => {
    const wrapper = mount( OtherFilesComponent );
    const iconPopup = wrapper.find( 'IconPopup' );
    const { type } = otherProps;
    const { popupMsg } = otherProps.config.types[type];

    wrapper.setProps( { ...otherProps, data } );
    await wait( 0 );
    wrapper.update();

    expect( iconPopup.exists() ).toEqual( true );
    expect( iconPopup.prop( 'message' ) ).toEqual( popupMsg );
  } );

  it.skip( 'renders EditSupportFiles with correct SRT files', async () => {
    const wrapper = mount( SrtFilesComponent );
    const { supportFiles } = data.projectFiles;

    wrapper.setProps( { ...srtProps, data } );
    await wait( 0 );
    wrapper.update();
    const editSupportFiles = wrapper.find( 'EditSupportFiles' );

    expect( wrapper.prop( 'projectId' ) ).toEqual( srtProps.projectId );
    expect( editSupportFiles.exists() ).toEqual( true );
    expect( editSupportFiles.prop( 'supportFiles' ) ).toEqual( supportFiles );
  } );

  it.skip( 'renders EditSupportFiles with correct Other files', async () => {
    const wrapper = mount( OtherFilesComponent );
    const { thumbnails } = data.projectFiles;

    wrapper.setProps( { ...otherProps, data } );
    await wait( 0 );
    wrapper.update();
    const editSupportFiles = wrapper.find( 'EditSupportFiles' );

    expect( wrapper.prop( 'projectId' ) ).toEqual( srtProps.projectId );
    expect( editSupportFiles.exists() ).toEqual( true );
    expect( editSupportFiles.prop( 'supportFiles' ) ).toEqual( thumbnails );
  } );

  it.skip( 'renders the correct SupportItem components for SRTs', async () => {
    const wrapper = mount( SrtFilesComponent );
    const { supportFiles } = data.projectFiles;

    wrapper.setProps( { ...srtProps, data } );
    await wait( 0 );
    wrapper.update();
    const supportItems = wrapper.find( 'SupportItem' );

    expect( supportItems.length ).toEqual( supportFiles.length );
    supportItems.forEach( ( supportItem, i ) => {
      expect( supportItem.prop( 'item' ) ).toEqual( supportFiles[i] );
    } );
  } );

  it.skip( 'renders the correct SupportItem components for Other files', async () => {
    const wrapper = mount( SrtFilesComponent );
    const { thumbnails } = data.projectFiles;

    wrapper.setProps( { ...otherProps, data } );
    await wait( 0 );
    wrapper.update();
    const supportItems = wrapper.find( 'SupportItem' );

    expect( supportItems.length ).toEqual( thumbnails.length );
    supportItems.forEach( ( supportItem, i ) => {
      expect( supportItem.prop( 'item' ) ).toEqual( thumbnails[i] );
    } );
  } );

  it.skip( 'renders no SRTs message', () => {
    const wrapper = mount( SrtFilesComponent );
    const supportItems = wrapper.find( 'SupportItem' );
    const msg = `Click the 'Edit' link to add ${srtProps.type} files`;

    expect( wrapper.contains( msg ) ).toEqual( true );
    expect( supportItems.length ).toEqual( 0 );
    expect( supportItems.exists() ).toEqual( false );
  } );

  it( 'renders no additional files message', () => {
    const wrapper = mount( OtherFilesComponent );
    const supportItems = wrapper.find( 'SupportItem' );
    const msg = 'Click the \'Edit\' link to add additional files';

    expect( wrapper.contains( msg ) ).toEqual( true );
    expect( supportItems.length ).toEqual( 0 );
    expect( supportItems.exists() ).toEqual( false );
  } );
} );
