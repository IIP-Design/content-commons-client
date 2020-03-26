import { mount } from 'enzyme';
import { props } from './mocks';
import PackageFiles from './PackageFiles';

jest.mock( 'next/dynamic', () => () => 'Press-Package-File' );
jest.mock(
  'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal',
  () => function EditPackageFiles() { return ''; }
);

jest.mock( 'lib/hooks/useCrudActionsDocument', () => ( {
  useCrudActionsDocument: () => ( {
    createFile: jest.fn(),
    deleteFile: jest.fn(),
    updateFile: jest.fn()
  } )
} ) );

jest.mock( 'next/config', () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

describe( '<PackageFiles />', () => {
  /**
   * @todo Suppress React 16.8 `act()` warnings globally.
   * The React team's fix won't be out of alpha until 16.9.0.
   * @see https://github.com/facebook/react/issues/14769
   */
  const consoleError = console.error;
  beforeAll( () => {
    const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';
    jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
      if ( !args[0].includes( actMsg ) ) {
        consoleError( ...args );
      }
    } );
  } );

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

  it( 'EditPackageFiles save calls props.setHasEdits', done => {
    const editPkgFiles = () => wrapper.find( 'EditPackageFiles' );
    const test = async () => {
      const filesToDelete = [
        {
          id: '3dxs',
          name: 'Rewards for Justice: Reward Offer for Those Involved in the 2017 “Tongo Tongo” Ambush in Niger.docx',
          use: 'ck2wbvj7u10lo07207aa55qmz',
          bureaus: [
            'sdfq'
          ],
          url: 'daily_guidance/2019/11/test-123/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.docx'
        }
      ];
      const filesToSave = [
        {
          id: '1asd',
          name: 'Lesotho National Day.docx',
          use: 'ck2wbvjaa10n20720fg5ayhn9',
          bureaus: [
            'sdfq'
          ],
          url: 'daily_guidance/2019/11/test-123/Lesotho_National_Day.docx'
        },
        {
          id: '2sdf',
          name: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event.docx',
          use: 'ck2wbvj7u10lo07207aa55qmz',
          bureaus: [
            'sdfq'
          ],
          url: 'daily_guidance/2019/11/test-123/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.docx'
        }
      ];

      await editPkgFiles().prop( 'save' )( filesToSave, filesToDelete );
      wrapper.update();

      expect( props.setHasEdits ).toHaveBeenCalledWith( true );
      done();
    };

    test();
  } );

  it( 'renders null if !hasInitialUploadCompleted', () => {
    wrapper.setProps( { hasInitialUploadCompleted: false } );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders null if pkg === {}', () => {
    wrapper.setProps( { pkg: {} } );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders no files message if pkg.documents === []', () => {
    wrapper.setProps( {
      pkg: {
        ...props.pkg,
        documents: []
      }
    } );
    const msg = 'This package does not have any uploaded files.';
    const { pkg } = wrapper.props();
    const count = pkg.documents.length;

    expect( wrapper.contains( msg ) ).toEqual( true );
    expect( wrapper.contains( `Uploaded File (${count})` ) ).toEqual( true );
  } );
} );
