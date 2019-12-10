import { mount } from 'enzyme';
import PackageDetailsForm from './PackageDetailsForm';

const props = {
  id: 'test-123',
  children: <div>just another child component</div>,
  handleSubmit: jest.fn(),
  handleChange: jest.fn(),
  hasUploadCompleted: false,
  values: {
    title: 'xyz.docx',
    type: 'Guidance',
    termsConditions: false
  },
  errors: {},
  touched: {},
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
  save: jest.fn(),
  router: {
    query: {
      id: 'test-123',
      action: 'create'
    }
  }
};

jest.mock(
  'components/admin/TermsConditions/TermsConditions',
  () => function TermsConditions() { return ''; }
);
jest.mock(
  'components/ButtonAddFiles/ButtonAddFiles',
  () => function ButtonAddFiles() {
    return 'Save draft & upload files';
  }
);
jest.mock(
  'components/admin/FormikAutoSave/FormikAutoSave',
  () => function FormikAutoSave() { return ''; }
);
jest.mock(
  'formik',
  () => ( {
    useFormikContext: jest.fn( () => ( {
      errors: {},
      touched: {},
      values: {
        title: 'xyz.docx',
        type: 'Guidance'
      }
    } ) )
  } )
);

describe( '<PackageDetailsForm />', () => {
  const Component = <PackageDetailsForm { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    // unwrapped form
    const form = wrapper.find( 'PackageDetailsForm' );

    expect( form.exists() ).toEqual( true );
  } );

  it( 'renders FormikAutoSave', () => {
    const wrapper = mount( Component );
    const autoSave = wrapper.find( 'FormikAutoSave' );

    expect( autoSave.exists() ).toEqual( true );
    expect( autoSave.prop( 'save' ) ).toEqual( props.save );
  } );

  it( 'renders the headline and required text', () => {
    const wrapper = mount( Component );
    const headline = wrapper.find( '.headline > .uppercase' );
    const required = wrapper.find( '.headline > .msg--required' );

    expect( headline.text() ).toEqual( 'Description' );
    expect( required.text() ).toEqual( 'Required Fields *' );
  } );

  it( 'renders the title label and input', () => {
    const wrapper = mount( Component );
    const form = wrapper.find( 'PackageDetailsForm' );
    const titleLabel = form.find( 'FormField[label="Title"] label' );
    const titleInput = form.find( 'FormField[label="Title"] input' );

    expect( titleLabel.prop( 'htmlFor' ) ).toEqual( titleInput.prop( 'id' ) );
    expect( titleInput.prop( 'required' ) ).toEqual( true );
    expect( titleInput.prop( 'value' ) ).toEqual( props.values.title );
    expect( titleInput.prop( 'name' ) ).toEqual( 'title' );
  } );

  it( 'renders the package type label and input', () => {
    const wrapper = mount( Component );
    const form = wrapper.find( 'PackageDetailsForm' );
    const typeLabel = form.find( 'FormField[label="Package Type"] label' );
    const typeInput = form.find( 'FormField[label="Package Type"] input' );

    expect( typeLabel.prop( 'htmlFor' ) ).toEqual( typeInput.prop( 'id' ) );
    expect( typeInput.prop( 'value' ) ).toEqual( props.values.type );
    expect( typeInput.prop( 'name' ) ).toEqual( 'type' );
    expect( typeInput.prop( 'readOnly' ) ).toEqual( true );
  } );

  it( 'renders TermsConditions if query string: ?action=create', () => {
    const wrapper = mount( Component );
    const termsConditions = wrapper.find( 'TermsConditions' );
    const hasError = props.touched.termsConditions && !!props.errors.termsConditions;

    expect( termsConditions.exists() ).toEqual( true );
    expect( termsConditions.prop( 'error' ) ).toEqual( hasError );
    expect( termsConditions.prop( 'handleOnChange' ).name )
      .toEqual( 'handleOnChange' );
  } );

  it( 'renders disabled ButtonAddFiles if termsConditions === false', () => {
    const wrapper = mount( Component );
    const buttonAddFiles = wrapper.find( 'ButtonAddFiles' );
    const msg = 'Save draft & upload files';

    expect( buttonAddFiles.exists() ).toEqual( true );
    expect( buttonAddFiles.contains( msg ) ).toEqual( true );
    expect( buttonAddFiles.prop( 'accept' ) ).toEqual( '.doc, .docx' );
    expect( buttonAddFiles.prop( 'fluid' ) ).toEqual( true );
    expect( buttonAddFiles.prop( 'multiple' ) ).toEqual( true );
    expect( buttonAddFiles.prop( 'disabled' ) )
      .toEqual( !props.values.termsConditions );
  } );

  it( 'renders the child nodes', () => {
    const wrapper = mount( Component );
    const form = wrapper.find( 'PackageDetailsForm' );

    expect( form.contains( props.children ) ).toEqual( true );
  } );
} );

describe( '<PackageDetailsForm />, if !props.router.query.action', () => {
  const noActionProps = {
    ...props,
    router: { query: { id: 'test-123' } }
  };
  const Component = <PackageDetailsForm { ...noActionProps } />;

  it( 'does not render TermsConditions', () => {
    const wrapper = mount( Component );
    const termsConditions = wrapper.find( 'TermsConditions' );

    expect( termsConditions.exists() ).toEqual( false );
  } );
} );

describe( '<PackageDetailsForm />, if termsConditions === true', () => {
  const acceptedTermsProps = {
    ...props,
    values: {
      ...props.values,
      termsConditions: true
    }
  };
  const Component = <PackageDetailsForm { ...acceptedTermsProps } />;

  it( 'renders enabled ButtonAddFiles', () => {
    const wrapper = mount( Component );
    const buttonAddFiles = wrapper.find( 'ButtonAddFiles' );
    const msg = 'Save draft & upload files';

    expect( buttonAddFiles.exists() ).toEqual( true );
    expect( buttonAddFiles.contains( msg ) ).toEqual( true );
    expect( buttonAddFiles.prop( 'accept' ) ).toEqual( '.doc, .docx' );
    expect( buttonAddFiles.prop( 'fluid' ) ).toEqual( true );
    expect( buttonAddFiles.prop( 'multiple' ) ).toEqual( true );
    expect( buttonAddFiles.prop( 'disabled' ) )
      .toEqual( !acceptedTermsProps.values.termsConditions );
  } );
} );

describe( '<PackageDetailsForm />, if uploads have been completed', () => {
  const completedUploadsProps = {
    ...props,
    values: {
      ...props.values,
      termsConditions: true
    },
    hasUploadCompleted: true
  };
  const Component = <PackageDetailsForm { ...completedUploadsProps } />;

  it( 'does not render TermsConditions & ButtonAddFiles if hasUploadCompleted', () => {
    const wrapper = mount( Component );
    const termsConditions = wrapper.find( 'TermsConditions' );
    const buttonAddFiles = wrapper.find( 'ButtonAddFiles' );

    expect( termsConditions.exists() ).toEqual( false );
    expect( buttonAddFiles.exists() ).toEqual( false );
  } );
} );
