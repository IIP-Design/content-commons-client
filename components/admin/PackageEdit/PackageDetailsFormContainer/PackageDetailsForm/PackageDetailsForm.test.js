import { mount } from 'enzyme';
import PackageDetailsForm from './PackageDetailsForm';
import { mocks } from '../../mocks';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

const props = {
  id: 'test-123',
  children: <div>just another child component</div>,
  handleSubmit: jest.fn(),
  handleChange: jest.fn(),
  hasInitialUploadCompleted: false,
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
  },
  pkg: { ...mocks[0].result.data.pkg }
};

jest.mock(
  'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal',
  () => function EditPackageFilesModal() { return ''; }
);

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

jest.mock( 'lib/hooks/useCrudActionsDocument', () => ( {
  useCrudActionsDocument: jest.fn( () => true )
} ) );

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
    const titleField = wrapper.find( 'FormField[name="title"]' );
    const titleLabel = wrapper.find( 'FormField[name="title"] label' );
    const titleInput = wrapper.find( 'FormField[name="title"] input' );

    expect( titleLabel.prop( 'htmlFor' ) ).toEqual( titleInput.prop( 'id' ) );
    expect( titleInput.prop( 'required' ) ).toEqual( true );
    expect( titleInput.prop( 'value' ) ).toEqual( props.values.title );
    expect( titleInput.prop( 'name' ) ).toEqual( 'title' );
    expect( titleField.prop( 'onChange' ).name ).toEqual( 'handleOnChange' );
  } );

  it( 'changing the title calls setFieldTouched and setFieldValue', () => {
    const wrapper = mount( Component );
    const titleField = wrapper.find( 'FormField[name="title"]' );
    const e = {};
    const data = {
      name: 'title',
      value: 'a new title',
      type: 'text'
    };

    titleField.prop( 'onChange' )( e, data );
    expect( props.setFieldTouched )
      .toHaveBeenCalledWith( data.name, true, false );
    expect( props.setFieldValue )
      .toHaveBeenCalledWith( data.name, data.value );
  } );

  it( 'checking TermsConditions calls setFieldTouched and setFieldValue', () => {
    const wrapper = mount( Component );
    const termsConditions = wrapper.find( 'TermsConditions' );
    const e = {};
    const data = {
      name: 'termsConditions',
      type: 'checkbox',
      checked: true
    };

    termsConditions.prop( 'handleOnChange' )( e, data );
    expect( props.setFieldTouched )
      .toHaveBeenCalledWith( data.name, true, false );
    expect( props.setFieldValue )
      .toHaveBeenCalledWith( data.name, data.checked );
  } );

  it( 'renders the package type label and input', () => {
    const wrapper = mount( Component );
    const typeLabel = wrapper.find( 'FormField[label="Package Type"] label' );
    const typeInput = wrapper.find( 'FormField[label="Package Type"] input' );

    expect( typeLabel.prop( 'htmlFor' ) ).toEqual( typeInput.prop( 'id' ) );
    expect( typeInput.prop( 'value' ) ).toEqual( props.values.type );
    expect( typeInput.prop( 'name' ) ).toEqual( 'type' );
    expect( typeInput.prop( 'readOnly' ) ).toEqual( true );
  } );

  it( 'renders the package team label and input', () => {
    const wrapper = mount( Component );
    const typeLabel = wrapper.find( 'FormField[label="Team"] label' );
    const typeInput = wrapper.find( 'FormField[label="Team"] input' );

    expect( typeLabel.prop( 'htmlFor' ) ).toEqual( typeInput.prop( 'id' ) );
    expect( typeInput.prop( 'value' ) ).toEqual( props.pkg.team.name );
    expect( typeInput.prop( 'name' ) ).toEqual( 'team' );
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
    const editPkgFilesModal = wrapper.find( 'EditPackageFilesModal' );
    const btnAddFilesProps = editPkgFilesModal.props( 'trigger' ).trigger.props;
    const msg = 'Save draft & upload files';

    expect( editPkgFilesModal.exists() ).toEqual( true );
    expect( btnAddFilesProps.children ).toEqual( msg );
    expect( btnAddFilesProps.accept ).toEqual( '.doc, .docx' );
    expect( btnAddFilesProps.fluid ).toEqual( true );
    expect( btnAddFilesProps.multiple ).toEqual( true );
    expect( btnAddFilesProps.disabled ).toEqual( !props.values.termsConditions );
  } );

  it( 'renders the child nodes', () => {
    const wrapper = mount( Component );
    const form = wrapper.find( 'PackageDetailsForm' );

    expect( form.contains( props.children ) ).toEqual( true );
  } );
} );

describe( '<PackageDetailsForm />, if form field errors', () => {
  const errorsProps = {
    ...props,
    values: {
      ...props.values,
      title: ''
    },
    errors: {
      title: 'A package title is required.',
      termsConditions: 'You have to agree with our Terms of Use!'
    },
    touched: {
      title: true,
      termsConditions: true
    }
  };
  const Component = <PackageDetailsForm { ...errorsProps } />;

  it( 'renders title field error and message', () => {
    const wrapper = mount( Component );
    const titleField = wrapper.find( 'FormField[name="title"]' );
    const errorMsg = wrapper.find( '.error-message' );
    const msg = 'A package title is required.';

    expect( titleField.prop( 'title' ) ).toEqual( undefined );
    expect( titleField.prop( 'error' ) ).toEqual( true );
    expect( errorMsg.text() ).toEqual( msg );
  } );

  it( 'renders TermsConditions error', () => {
    const wrapper = mount( Component );
    const termsConditions = wrapper.find( 'TermsConditions' );

    expect( termsConditions.prop( 'error' ) ).toEqual( true );
  } );
} );

/*
* Shawn 2/3/20 - relevant only on initial upload, commenting out for now
*/
// describe( '<PackageDetailsForm />, if !props.router.query.action', () => {
//   const noActionProps = {
//     ...props,
//     router: { query: { id: 'test-123' } }
//   };
//   const Component = <PackageDetailsForm { ...noActionProps } />;

//   it( 'does not render TermsConditions', () => {
//     const wrapper = mount( Component );
//     const termsConditions = wrapper.find( 'TermsConditions' );

//     expect( termsConditions.exists() ).toEqual( false );
//   } );
// } );

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
    const msg = 'Save draft & upload files';

    const editPkgFilesModal = wrapper.find( 'EditPackageFilesModal' ); // ButtonAddFiles parent
    const btnAddFilesProps = editPkgFilesModal.props( 'trigger' ).trigger.props;
    expect( editPkgFilesModal.exists() ).toEqual( true );
    expect( btnAddFilesProps.children ).toEqual( msg );
    expect( btnAddFilesProps.accept ).toEqual( '.doc, .docx' );
    expect( btnAddFilesProps.fluid ).toEqual( true );
    expect( btnAddFilesProps.multiple ).toEqual( true );
    expect( btnAddFilesProps.disabled ).toEqual( !acceptedTermsProps.values.termsConditions );
  } );
} );

describe( '<PackageDetailsForm />, if uploads have been completed', () => {
  const completedUploadsProps = {
    ...props,
    values: {
      ...props.values,
      termsConditions: true
    },
    hasInitialUploadCompleted: true
  };
  const Component = <PackageDetailsForm { ...completedUploadsProps } />;

  it( 'does not render TermsConditions & ButtonAddFiles if hasUploadCompleted', () => {
    const wrapper = mount( Component );
    const termsConditions = wrapper.find( 'TermsConditions' );
    const editPkgFilesModal = wrapper.find( 'EditPackageFilesModal' ); // ButtonAddFiles parent

    expect( termsConditions.exists() ).toEqual( false );
    expect( editPkgFilesModal.exists() ).toEqual( false );
  } );
} );
