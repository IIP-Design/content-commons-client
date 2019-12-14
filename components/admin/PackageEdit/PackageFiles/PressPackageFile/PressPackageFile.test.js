import { mount } from 'enzyme';
import { MockedProvider, wait } from '@apollo/react-testing';
import {
  errorMocks, mocks, props, undefinedDataMocks
} from './mocks';
import PressPackageFile from './PressPackageFile';

jest.mock(
  'components/admin/dropdowns/TagDropdown/TagDropdown',
  () => function TagDropdown() { return ''; }
);
jest.mock(
  'components/admin/dropdowns/UseDropdown/UseDropdown',
  () => function UseDropdown() { return ''; }
);
jest.mock(
  'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown',
  () => function VisibilityDropdown() { return ''; }
);
jest.mock(
  'components/admin/MetaTerms/MetaTerms',
  () => function MetaTerms() { return ''; }
);
jest.mock(
  'formik',
  () => ( {
    useFormikContext: jest.fn( () => ( {
      errors: {},
      touched: {},
      values: {
        '1asd': {
          filename: 'Lesotho National Day.docx'
        }
      }
    } ) )
  } )
);
jest.mock(
  'components/admin/FormikAutoSave/FormikAutoSave',
  () => function FormikAutoSave() { return ''; }
);

const Component = (
  <MockedProvider mocks={ mocks }>
    <PressPackageFile { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks }>
    <PressPackageFile { ...props } />
  </MockedProvider>
);

const UndefinedDataComponent = (
  <MockedProvider mocks={ undefinedDataMocks }>
    <PressPackageFile { ...props } />
  </MockedProvider>
);

describe( '<PressPackageFile />', () => {
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

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const pressPkgFile = wrapper.find( 'PressPackageFile' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading package file...';

    expect( pressPkgFile.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( msg ) ).toEqual( true );
  } );

  it( 'renders error message if a GraphQL error is returned', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();

    const apolloError = wrapper.find( 'ApolloError' );
    const msg = 'There was an error.';

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.contains( msg ) ).toEqual( true );
  } );

  it( 'returns ApolloError if `data === undefined` is returned', async () => {
    const wrapper = mount( UndefinedDataComponent );
    await wait( 0 );
    wrapper.update();
    const apolloError = wrapper.find( 'ApolloError' );

    expect( apolloError.exists() ).toEqual( true );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const pressPkgFile = wrapper.find( 'PressPackageFile' );
    const div = wrapper.find( 'PressPackageFile > div' );

    expect( pressPkgFile.exists() ).toEqual( true );
    expect( div.prop( 'id' ) ).toEqual( props.id );
    expect( div.prop( 'className' ) ).toEqual( 'package-file' );
  } );

  it( 'renders the file title input field', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const titleLabel = wrapper.find( 'FormField[label="Title"] label' );
    const titleInput = wrapper.find( 'FormField[label="Title"] input' );
    const { documentFile } = mocks[0].result.data;

    expect( titleLabel.prop( 'htmlFor' ) ).toEqual( titleInput.prop( 'id' ) );
    expect( titleInput.prop( 'required' ) ).toEqual( true );
    expect( titleInput.prop( 'value' ) ).toEqual( documentFile.filename );
    expect( titleInput.prop( 'name' ) )
      .toEqual( `${documentFile.id}.filename` );
  } );

  it( 'renders the Bureaus dropdown', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const { documentFile } = mocks[0].result.data;
    const dropdowns = wrapper.find( `FormDropdown` );
    const dropdown = dropdowns.findWhere( n => n.prop( 'label' ) === 'Lead Bureau(s)' && n.name() === 'FormDropdown' );
    const helperTxt = wrapper.find( 'TagDropdown + [className="field__helper-text"]' );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'id' ) ).toEqual( `bureaus-${documentFile.id}` );
    expect( dropdown.prop( 'name' ) )
      .toEqual( `${documentFile.id}.bureaus` );
    expect( dropdown.prop( 'required' ) ).toEqual( true );
    expect( helperTxt.text() ).toEqual( 'Enter keywords separated by commas.' );
  } );

  it( 'renders the Release Type (Use) dropdown', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const { documentFile } = mocks[0].result.data;
    const dropdown = wrapper.find( `UseDropdown` );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'id' ) ).toEqual( `use-${documentFile.id}` );
    expect( dropdown.prop( 'type' ) ).toEqual( 'document' );
    expect( dropdown.prop( 'label' ) ).toEqual( 'Release Type' );
    expect( dropdown.prop( 'name' ) )
      .toEqual( `${documentFile.id}.use` );
    expect( dropdown.prop( 'required' ) ).toEqual( true );
  } );

  it( 'renders the Visibility dropdown', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const { documentFile } = mocks[0].result.data;
    const dropdown = wrapper.find( `VisibilityDropdown` );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'id' ) ).toEqual( `visibility-${documentFile.id}` );
    expect( dropdown.prop( 'label' ) ).toEqual( 'Visibility Setting' );
    expect( dropdown.prop( 'name' ) )
      .toEqual( `${documentFile.id}.visibility` );
    expect( dropdown.prop( 'required' ) ).toEqual( true );
  } );

  it( 'renders the Tag dropdown', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const { documentFile } = mocks[0].result.data;
    const dropdown = wrapper.find( 'TagDropdown' );
    const helperTxt = wrapper.find( 'TagDropdown + [className="field__helper-text"]' );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'id' ) ).toEqual( `tags-${documentFile.id}` );
    expect( dropdown.prop( 'label' ) ).toEqual( 'Tags' );
    expect( dropdown.prop( 'name' ) )
      .toEqual( `${documentFile.id}.tags` );
    expect( helperTxt.text() ).toEqual( 'Enter keywords separated by commas.' );
  } );

  it( 'renders MetaTerms', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const { documentFile } = mocks[0].result.data;
    const meta = wrapper.find( 'MetaTerms' );
    const metaData = [
      {
        name: 'file-name',
        displayName: 'File Name',
        definition: documentFile.filename || ''
      },
      {
        name: 'pages',
        displayName: 'Pages',
        definition: 'TBD'
      }
    ];

    expect( meta.exists() ).toEqual( true );
    expect( meta.prop( 'unitId' ) ).toEqual( props.id );
    expect( meta.prop( 'terms' ) ).toEqual( metaData );
  } );

  /**
   * Add tests for Formik once validationSchema is finalized
   */
} );
