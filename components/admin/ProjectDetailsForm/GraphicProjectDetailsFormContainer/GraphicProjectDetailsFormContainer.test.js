import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { initialSchema, baseSchema } from './validationSchema';
import GraphicProjectDetailsFormContainer from './GraphicProjectDetailsFormContainer';
import { data } from './mocks';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
  },
} ) );

jest.mock( 'context/authContext', () => ( {
  useAuth: jest.fn( () => true ),
} ) );

jest.mock(
  'components/Notification/Notification',
  () => function Notification() { return ''; },
);

jest.mock(
  'components/admin/ProjectDetailsForm/ProjectDetailsForm',
  () => function ProjectDetailsForm() { return ''; },
);

const props = {
  id: 'project-123',
  contentStyle: { border: '3px solid transparent' },
  data,
  updateNotification: jest.fn(),
  handleUpload: jest.fn(),
  setIsFormValid: jest.fn(),
};

const config = {
  headline: 'Social Media Graphics Project Data',
  projectTitle: {
    label: 'Project Name',
    required: true,
  },
  visibility: {
    label: 'Visibility Setting',
    required: true,
  },
  team: {
    label: 'Source',
    required: false,
  },
  copyright: {
    label: 'Copyright',
    required: true,
  },
  categories: {
    label: 'Categories',
    required: true,
  },
  tags: {
    label: 'Tags',
    required: false,
  },
  descPublic: {
    label: 'Public Description',
    required: false,
  },
  descInternal: {
    label: 'Internal Description',
    required: false,
  },
  alt: {
    label: 'Alt (Alternative) Text',
    required: false,
  },
};

const getInitialValues = () => {
  const { graphicProject } = props.data;
  const {
    title, visibility, team, copyright, categories, tags, descPublic, descInternal, alt,
  } = graphicProject;

  const initialValues = {
    projectTitle: title || '',
    visibility: visibility || 'PUBLIC',
    team: team.name,
    copyright: copyright || 'COPYRIGHT',
    categories: categories.map( category => category.id ),
    tags: tags.map( tag => tag.id ),
    descPublic: descPublic.content || '',
    descInternal: descInternal.content || '',
    alt: alt || '',
  };

  return initialValues;
};

describe( '<GraphicProjectDetailsFormContainer />', () => {
  let Component;
  let wrapper;
  let formContainer;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] }>
        <GraphicProjectDetailsFormContainer { ...props } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    formContainer = wrapper.find( 'GraphicProjectDetailsFormContainer' );
  } );

  it( 'renders without crashing', () => {
    // console.log( formContainer.debug() );
    expect( wrapper.exists() ).toEqual( true );
    expect( formContainer.exists() ).toEqual( true );
  } );

  it( 'renders the correct wrapper className value', () => {
    const contentDiv = formContainer.find( '.graphic-project-details-form-container' );

    expect( contentDiv.exists() ).toEqual( true );
    expect( contentDiv.prop( 'style' ) ).toEqual( props.contentStyle );
  } );

  it( 'renders the Formik component', () => {
    const formik = formContainer.find( 'Formik' );

    expect( formik.exists() ).toEqual( true );
    expect( formik.prop( 'initialValues' ) ).toEqual( getInitialValues() );
    expect( formik.prop( 'validationSchema' ) ).toEqual( baseSchema );
  } );

  it( 'renders the ProjectDetailsForm', () => {
    const projectDetailsForm = formContainer.find( 'ProjectDetailsForm' );

    expect( projectDetailsForm.exists() ).toEqual( true );
    expect( projectDetailsForm.prop( 'id' ) ).toEqual( props.id );
    expect( projectDetailsForm.prop( 'data' ) ).toEqual( props.data );
    expect( projectDetailsForm.prop( 'config' ) ).toEqual( config );
  } );
} );

describe( '<GraphicProjectDetailsFormContainer />, if there is no props.id', () => {
  let Component;
  let wrapper;
  let formContainer;

  const newProps = {
    ...props,
    id: undefined,
  };

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] }>
        <GraphicProjectDetailsFormContainer { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    formContainer = wrapper.find( 'GraphicProjectDetailsFormContainer' );
  } );

  it( 'renders the Formik component with the initial schema', () => {
    const formik = formContainer.find( 'Formik' );

    expect( formik.exists() ).toEqual( true );
    expect( formik.prop( 'validationSchema' ) ).toEqual( initialSchema );
  } );
} );
