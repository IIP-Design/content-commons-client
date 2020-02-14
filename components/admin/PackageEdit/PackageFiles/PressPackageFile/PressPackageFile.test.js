import { mount } from 'enzyme';
import { HandleOnChangeContext } from 'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsForm/PackageDetailsForm';
import { AWS_URL, AWS_SIGNED_URL_QUERY_STRING } from '../mocks';
import PressPackageFile from './PressPackageFile';

jest.mock(
  'components/admin/dropdowns/CountriesRegionsDropdown/CountriesRegionsDropdown',
  () => function CountriesRegionsDropdown() { return ''; }
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
  'components/admin/dropdowns/BureauOfficesDropdown/BureauOfficesDropdown',
  () => function BureauOfficesDropdown() { return ''; }
);
jest.mock(
  'components/admin/MetaTerms/MetaTerms',
  () => function MetaTerms() { return ''; }
);
jest.mock(
  'components/admin/FormikAutoSave/FormikAutoSave',
  () => function FormikAutoSave() { return ''; }
);
jest.mock( 'next/dynamic', () => () => 'Dynamic' );
jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );
jest.mock(
  'formik',
  () => ( {
    useFormikContext: jest.fn( () => ( {
      errors: {},
      touched: {},
      values: {
        '1asd': {
          id: '1asd',
          title: 'Lesotho National Day',
          bureaus: [],
          countries: ['ck2lzgu5b0rho07207cqfeya0'],
          use: 'ck2wbvjaa10n20720fg5ayhn9',
          visibility: 'INTERNAL'
        }
      }
    } ) )
  } )
);

const id = 'test-123';
const props = {
  document: {
    id: '1asd',
    title: 'Lesotho National Day',
    filename: 'Lesotho National Day.docx',
    image: [
      {
        __typename: 'ImageFile',
        id: 'th1',
        createdAt: '2019-11-12T13:01:01.906Z',
        updatedAt: '2019-11-12T13:01:01.906Z',
        filename: 'lesotho_national_day.png',
        filetype: 'png',
        filesize: 35000,
        visibility: 'PUBLIC',
        alt: 'thumbnail of guidance document',
        url: `2019/11/${id}/lesotho_national_day.png`,
        signedUrl: `${AWS_URL}/2019/11/${id}/lesotho_national_day.png${AWS_SIGNED_URL_QUERY_STRING}`,
        language: {
          __typename: 'Language',
          id: 'ck2lzfx710hkq07206thus6pt',
          languageCode: 'en',
          locale: 'en-us',
          textDirection: 'LTR',
          displayName: 'English',
          nativeName: 'English'
        },
        use: {
          __typename: 'ImageUse',
          id: 'ck2lzfx510hhj07205mal3e4l',
          name: 'Thumbnail/Cover Image'
        }
      }
    ]
  }
};

const handleOnChange = jest.fn().mockName( 'handleOnChange' );

const Component = (
  <HandleOnChangeContext.Provider value={ handleOnChange }>
    <PressPackageFile { ...props } />
  </HandleOnChangeContext.Provider>
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

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the file title input field', () => {
    const wrapper = mount( Component );
    const titleLabel = wrapper.find( 'FormField[label="Title"] label' );
    const titleInput = wrapper.find( 'FormField[label="Title"] input' );
    const { document } = props;

    expect( titleLabel.prop( 'htmlFor' ) ).toEqual( titleInput.prop( 'id' ) );
    expect( titleInput.prop( 'required' ) ).toEqual( true );
    expect( titleInput.prop( 'value' ) ).toEqual( document.title );
    expect( titleInput.prop( 'name' ) )
      .toEqual( `${document.id}.title` );
  } );

  it( 'changing the title input field calls handleOnChange', () => {
    const wrapper = mount( Component );
    const titleInput = wrapper.find( 'FormField[label="Title"]' );
    const { onChange } = titleInput.props();
    const e = {};
    const data = {
      name: '1asd.title',
      value: 'Lesotho National Day',
      type: 'text'
    };

    onChange( e, data );
    expect( onChange.getMockName() ).toEqual( 'handleOnChange' );
    expect( handleOnChange ).toHaveBeenCalledWith( e, data );
  } );

  it( 'renders the Bureaus dropdown', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( `BureauOfficesDropdown` );
    const helperTxt = wrapper.find( 'BureauOfficesDropdown + [className="field__helper-text"]' );
    const { document } = props;

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'id' ) ).toEqual( `bureaus-${document.id}` );
    expect( dropdown.prop( 'name' ) )
      .toEqual( `${document.id}.bureaus` );
    expect( dropdown.prop( 'required' ) ).toEqual( true );
    expect( helperTxt.text() ).toEqual( 'Begin typing bureau name and separate by commas.' );
  } );

  it( 'changing the Bureaus dropdown calls handleOnChange', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( `BureauOfficesDropdown` );
    const { onChange } = dropdown.props();
    const e = {};
    const data = {
      name: `${props.document.id}.bureaus`,
      value: ['new-bureaus-id'],
    };

    onChange( e, data );
    expect( onChange.getMockName() ).toEqual( 'handleOnChange' );
    expect( handleOnChange ).toHaveBeenCalledWith( e, data );
  } );

  it( 'renders the Release Type (Use) dropdown', () => {
    const wrapper = mount( Component );
    const { document } = props;
    const dropdown = wrapper.find( `UseDropdown` );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'id' ) ).toEqual( `use-${document.id}` );
    expect( dropdown.prop( 'type' ) ).toEqual( 'document' );
    expect( dropdown.prop( 'label' ) ).toEqual( 'Release Type' );
    expect( dropdown.prop( 'name' ) ).toEqual( `${document.id}.use` );
    expect( dropdown.prop( 'required' ) ).toEqual( true );
  } );

  it( 'changing the Release Type (Use) dropdown calls handleOnChange', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'UseDropdown' );
    const { onChange } = dropdown.props();
    const e = {};
    const data = {
      name: `${props.document.id}.use`,
      value: 'new-use-id',
    };

    onChange( e, data );
    expect( onChange.getMockName() ).toEqual( 'handleOnChange' );
    expect( handleOnChange ).toHaveBeenCalledWith( e, data );
  } );

  it( 'renders the Visibility dropdown', () => {
    const wrapper = mount( Component );
    const { document } = props;
    const dropdown = wrapper.find( `VisibilityDropdown` );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'id' ) ).toEqual( `visibility-${document.id}` );
    expect( dropdown.prop( 'label' ) ).toEqual( 'Visibility Setting' );
    expect( dropdown.prop( 'name' ) ).toEqual( `${document.id}.visibility` );
    expect( dropdown.prop( 'required' ) ).toEqual( true );
  } );

  it( 'changing Visibility calls handleOnChange', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'CountriesRegionsDropdown' );
    const { onChange } = dropdown.props();
    const e = {};
    const data = {
      name: `${props.document.id}.visibility`,
      value: 'PUBLIC',
    };

    onChange( e, data );
    expect( onChange.getMockName() ).toEqual( 'handleOnChange' );
    expect( handleOnChange ).toHaveBeenCalledWith( e, data );
  } );

  it( 'renders the Countries/Regions dropdown', () => {
    const wrapper = mount( Component );
    const { document } = props;
    const dropdown = wrapper.find( 'CountriesRegionsDropdown' );
    const helperTxt = wrapper.find( 'CountriesRegionsDropdown + [className="field__helper-text"]' );

    expect( dropdown.exists() ).toEqual( true );
    expect( dropdown.prop( 'id' ) ).toEqual( `countries-${document.id}` );
    expect( dropdown.prop( 'label' ) ).toEqual( 'Countries/Regions Tags' );
    expect( dropdown.prop( 'name' ) ).toEqual( `${document.id}.countries` );
    expect( helperTxt.text() ).toEqual( 'Enter keywords separated by commas.' );
  } );

  it( 'changing the Countries/Regions calls handleOnChange', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'CountriesRegionsDropdown' );
    const { onChange } = dropdown.props();
    const e = {};
    const data = {
      name: `${props.document.id}.countries`,
      value: ['new-tag-id'],
    };

    onChange( e, data );
    expect( onChange.getMockName() ).toEqual( 'handleOnChange' );
    expect( handleOnChange ).toHaveBeenCalledWith( e, data );
  } );

  it( 'renders MetaTerms', () => {
    const wrapper = mount( Component );
    const { document } = props;
    const meta = wrapper.find( 'MetaTerms' );
    const metaData = [
      {
        name: 'file-name',
        displayName: 'File Name',
        definition: document.filename || ''
      },
      {
        name: 'pages',
        displayName: 'Pages',
        definition: 'TBD'
      }
    ];

    expect( meta.exists() ).toEqual( true );
    expect( meta.prop( 'unitId' ) ).toEqual( props.document.id );
    expect( meta.prop( 'terms' ) ).toEqual( metaData );
  } );

  it( 'renders fieldset', () => {
    const wrapper = mount( Component );
    const fieldset = wrapper.find( 'fieldset' );

    expect( fieldset.exists() ).toEqual( true );
    expect( fieldset.length ).toEqual( 1 );
    expect( fieldset.hasClass( 'form-fields' ) ).toEqual( true );
    expect( fieldset.prop( 'name' ) ).toEqual( props.document.filename );
  } );

  it( 'renders legend', () => {
    const wrapper = mount( Component );
    /**
     * Find legend as follows to test that the
     * legend is nested inside of the fieldset
     */
    const legend = wrapper.find( 'fieldset legend' );
    const content = `edit fields for ${props.document.filename}`;

    expect( legend.exists() ).toEqual( true );
    expect( legend.length ).toEqual( 1 );
    expect( legend.hasClass( 'hide-visually' ) ).toEqual( true );
    expect( legend.contains( content ) ).toEqual( true );
  } );

  it( 'renders null if !document', () => {
    const nullProps = {
      ...props,
      document: null
    };
    const NullComponent = (
      <HandleOnChangeContext.Provider value={ handleOnChange }>
        <PressPackageFile { ...nullProps } />
      </HandleOnChangeContext.Provider>
    );
    const wrapper = mount( NullComponent );

    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders null if document === {}', () => {
    const emptyProps = {
      ...props,
      document: {}
    };
    const EmptyComponent = (
      <HandleOnChangeContext.Provider value={ handleOnChange }>
        <PressPackageFile { ...emptyProps } />
      </HandleOnChangeContext.Provider>
    );
    const wrapper = mount( EmptyComponent );

    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'renders a thumbnail placeholder if !props.image', () => {
    const nullImgProps = {
      ...props,
      document: {
        ...props.document,
        image: null
      }
    };
    const NullImgComponent = (
      <HandleOnChangeContext.Provider value={ handleOnChange }>
        <PressPackageFile { ...nullImgProps } />
      </HandleOnChangeContext.Provider>
    );
    const wrapper = mount( NullImgComponent );
    const placeholderOuter = wrapper.find( '.placeholder.outer' );
    const placeholderInner = wrapper.find( '.placeholder.inner' );
    const loader = wrapper.find( 'Loader' );

    expect( placeholderOuter.exists() ).toEqual( true );
    expect( placeholderInner.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.prop( 'active' ) ).toEqual( true );
    expect( loader.prop( 'size' ) ).toEqual( 'small' );
  } );

  it( 'renders a thumbnail placeholder if props.image === []', () => {
    const emptyImgProps = {
      ...props,
      document: {
        ...props.document,
        image: []
      }
    };
    const EmptyImgComponent = (
      <HandleOnChangeContext.Provider value={ handleOnChange }>
        <PressPackageFile { ...emptyImgProps } />
      </HandleOnChangeContext.Provider>
    );
    const wrapper = mount( EmptyImgComponent );
    const placeholderOuter = wrapper.find( '.placeholder.outer' );
    const placeholderInner = wrapper.find( '.placeholder.inner' );
    const loader = wrapper.find( 'Loader' );

    expect( placeholderOuter.exists() ).toEqual( true );
    expect( placeholderInner.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.prop( 'active' ) ).toEqual( true );
    expect( loader.prop( 'size' ) ).toEqual( 'small' );
  } );

  /**
   * Add tests for Formik once validationSchema is finalized
   */
} );
