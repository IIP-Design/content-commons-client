import { mount } from 'enzyme';
import { MockedProvider, wait } from '@apollo/react-testing';
import {
  errorMocks, mocks, props, undefinedDataMocks
} from 'components/admin/PackageEdit/PackageFiles/mocks';
import PackageDetailsFormContainer from './PackageDetailsFormContainer';

jest.mock(
  'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsForm/PackageDetailsForm',
  () => function PackageDetailsForm() { return ''; }
);

const Component = (
  <MockedProvider mocks={ mocks }>
    <PackageDetailsFormContainer { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks }>
    <PackageDetailsFormContainer { ...props } />
  </MockedProvider>
);

const UndefinedDataComponent = (
  <MockedProvider mocks={ undefinedDataMocks }>
    <PackageDetailsFormContainer { ...props } />
  </MockedProvider>
);

describe( '<PackageDetailsFormContainer />', () => {
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
    const formContainer = wrapper.find( 'PackageDetailsFormContainer' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading package details form...';

    expect( formContainer.exists() ).toEqual( true );
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

  it( 'renders ApolloError if `data === undefined` is returned', async () => {
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
    const formContainer = wrapper.find( 'PackageDetailsFormContainer' );

    expect( formContainer.exists() ).toEqual( true );
  } );

  it( 'renders Formik component', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const formik = wrapper.find( 'Formik' );

    expect( formik.exists() ).toEqual( true );
  } );

  it( 'Formik receives the correct initialValues', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const formik = wrapper.find( 'Formik' );
    const { pkg, pkg: { documents } } = mocks[0].result.data;
    const fileValues = documents.reduce( ( acc, file ) => {
      const {
        id, bureaus, title, tags, use, visibility
      } = file;
      return {
        ...acc,
        [id]: {
          id,
          title,
          bureaus: bureaus.map( p => p.id ),
          tags: tags.map( p => p.id ),
          use: use.id,
          visibility
        }
      };
    }, {} );

    const initialValues = {
      title: pkg.title || '',
      type: pkg.type || '',
      termsConditions: false,
      ...fileValues
    };

    expect( formik.prop( 'initialValues' ) ).toEqual( initialValues );
  } );

  it( 'renders PackageDetailsForm and passes correct props', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const detailsForm = wrapper.find( 'PackageDetailsForm' );
    const passedProps = [
      'values',
      'errors',
      'touched',
      'status',
      'isSubmitting',
      'isValidating',
      'submitCount',
      'initialValues',
      'initialErrors',
      'initialTouched',
      'initialStatus',
      'handleBlur',
      'handleChange',
      'handleReset',
      'handleSubmit',
      'resetForm',
      'setErrors',
      'setFormikState',
      'setFieldTouched',
      'setFieldValue',
      'setFieldError',
      'setStatus',
      'setSubmitting',
      'setTouched',
      'setValues',
      'submitForm',
      'validateForm',
      'validateField',
      'isValid',
      'dirty',
      'unregisterField',
      'registerField',
      'getFieldProps',
      'getFieldMeta',
      'validateOnBlur',
      'validateOnChange',
      'validateOnMount',
      'id',
      'children',
      'setIsDirty',
      'save'
    ];

    expect( detailsForm.exists() ).toEqual( true );
    expect( Object.keys( detailsForm.props() ) ).toEqual( passedProps );
  } );

  it( 'renders Notification but does not show initially', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( true );
    expect( notification.prop( 'show' ) ).toEqual( false );
    expect( notification.prop( 'msg' ) ).toEqual( 'Changes saved' );
  } );

  it( 'renders Notification and shows on form save', async done => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const notification = () => wrapper.find( 'Notification' );
    const detailsForm = wrapper.find( 'PackageDetailsForm' );

    // not shown initially
    expect( notification().exists() ).toEqual( true );
    expect( notification().prop( 'show' ) ).toEqual( false );

    const test = async () => {
      const values = { title: 'new title' };
      const prevValues = { title: 'old title' };

      await detailsForm.prop( 'save' )( values, prevValues );
      wrapper.update();

      // shown
      expect( notification().prop( 'show' ) ).toEqual( true );
      done();
    };

    test();
  } );
} );
