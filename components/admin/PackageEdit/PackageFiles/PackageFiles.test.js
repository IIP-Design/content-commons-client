import { mount } from 'enzyme';
import { suppressActWarning } from 'lib/utils';
import { props } from './mocks';
import PackageFiles from './PackageFiles';

jest.mock( 'next/dynamic', () => () => 'Press-Package-File' );
jest.mock(
  'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal',
  () => function EditPackageFiles() { return ''; },
);

jest.mock( 'lib/hooks/useCrudActionsDocument', () => ( {
  useCrudActionsDocument: () => ( {
    createFile: jest.fn(),
    deleteFile: jest.fn(),
    updateFile: jest.fn(),
  } ),
} ) );

jest.mock( 'next/config', () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

describe.skip( '<PackageFiles />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <PackageFiles { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct PressPackageFile components with correct document prop', () => {
    const pressPkgFiles = wrapper.find( 'Press-Package-File' );
    const { documents } = props.pkg;

    expect( pressPkgFiles.length ).toEqual( documents.length );
    pressPkgFiles.forEach( ( file, i ) => {
      expect( file.prop( 'document' ) ).toEqual( documents[i] );
    } );
  } );

  it( 'renders the correct heading', () => {
    const { documents } = props.pkg;
    const heading = `Uploaded File${documents.length > 1 ? 's' : ''} (${documents.length})`;

    expect( wrapper.contains( heading ) ).toEqual( true );
  } );

  it( 'renders EditPackageFiles with correct props', () => {
    const editPkgFiles = wrapper.find( 'EditPackageFiles' );
    const units = props.pkg.documents || [];

    expect( editPkgFiles.exists() ).toEqual( true );
    expect( editPkgFiles.prop( 'filesToEdit' ) ).toEqual( units );
    expect( editPkgFiles.prop( 'extensions' ) ).toEqual( ['.doc', '.docx'] );
    expect( editPkgFiles.prop( 'title' ) ).toEqual( 'Edit Package Files' );
    expect( editPkgFiles.prop( 'modalOpen' ) ).toEqual( false );
    expect( editPkgFiles.prop( 'save' ).name ).toEqual( 'handleSave' );
    expect( typeof editPkgFiles.prop( 'save' ) ).toEqual( 'function' );
    expect( editPkgFiles.prop( 'onClose' ).name ).toEqual( 'handleCloseModal' );
    expect( typeof editPkgFiles.prop( 'onClose' ) ).toEqual( 'function' );
    expect( editPkgFiles.prop( 'progress' ) ).toEqual( 0 );
  } );

  it( 'EditPackageFiles trigger/onClose opens/closes the modal', () => {
    const editPkgFiles = () => wrapper.find( 'EditPackageFiles' );
    const trigger = mount( editPkgFiles().prop( 'trigger' ) );

    // closed initially
    expect( editPkgFiles().prop( 'modalOpen' ) ).toEqual( false );

    // open the modal
    trigger.simulate( 'click' );
    wrapper.update();
    expect( editPkgFiles().prop( 'modalOpen' ) ).toEqual( true );

    // close the modal
    editPkgFiles().prop( 'onClose' )();
    wrapper.update();
    expect( editPkgFiles().prop( 'modalOpen' ) ).toEqual( false );
  } );

  it( 'renders null if !hasInitialUploadCompleted', () => {
    wrapper.setProps( { hasInitialUploadCompleted: false } );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders null if pkg === {}', () => {
    wrapper.setProps( { pkg: {} } );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders the no files message and heading if there are no package documents', () => {
    const msg = 'This package does not have any uploaded files. Please upload at least one file to publish this package to Content Commons.';

    wrapper.setProps( { pkg: { documents: [] } } );

    expect( wrapper.contains( 'Uploaded File (0)' ) ).toEqual( true );
    expect( wrapper.contains( msg ) ).toEqual( true );
  } );
} );
