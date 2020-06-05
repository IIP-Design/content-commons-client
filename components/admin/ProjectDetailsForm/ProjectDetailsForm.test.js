import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ProjectDetailsForm from './ProjectDetailsForm';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
  },
} ) );

jest.mock(
  'components/admin/FormikAutoSave/FormikAutoSave',
  () => function FormikAutoSave() { return ''; },
);

jest.mock(
  'components/admin/TermsConditions/TermsConditions',
  () => function TermsConditions() { return ''; },
);

jest.mock(
  'components/admin/dropdowns/TagDropdown/TagDropdown',
  () => function TagDropdown() { return ''; },
);

jest.mock(
  'components/admin/dropdowns/UserDropdown/UserDropdown',
  () => function UserDropdown() { return ''; },
);

jest.mock(
  'components/admin/dropdowns/CategoryDropdown/CategoryDropdown',
  () => function CategoryDropdown() { return ''; },
);

jest.mock(
  'components/admin/dropdowns/CopyrightDropdown/CopyrightDropdown',
  () => function CopyrightDropdown() { return ''; },
);

jest.mock(
  'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown',
  () => function VisibilityDropdown() { return ''; },
);

const props = {
  maxCategories: 2,
  values: {
    projectTitle: 'Just a test title',
    visibility: 'visibility-12345',
    author: 'author-aidkwi83',
    team: 'team-dfiiad',
    copyright: 'NO_COPYRIGHT',
    categories: ['category-123'],
    tags: ['tag-123'],
    descPublic: 'public description',
    descInternal: 'internal description',
    alt: 'some alt text',
  },
  errors: {},
  touched: {},
  isValid: true,
  dirty: false,
  handleSubmit: jest.fn(),
  handleChange: jest.fn(),
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
  save: jest.fn(),
  config: {
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
  },
};

describe( '<ProjectDetailsForm />, for graphic projects', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ProjectDetailsForm { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'has "edit-project__form project-data" class values', () => {
    const form = wrapper.find( 'Form' );

    expect( form.hasClass( 'edit-project__form project-data' ) )
      .toEqual( true );
  } );

  it( 'submit btn is disabled initially', () => {
    const submitBtn = wrapper.find( 'button.edit-project__form--save' );

    expect( submitBtn.prop( 'disabled' ) ).toEqual( true );
  } );

  it( 'submit btn is not disabled if touched or isValid', () => {
    const newProps = {
      ...props,
      touched: {
        projectTitle: true,
        termsConditions: true,
        categories: true,
        copyright: true,
      },
      dirty: true,
    };

    const newWrapper = mount( <ProjectDetailsForm { ...newProps } /> );
    const submitBtn = newWrapper.find( 'Button.edit-project__form--save' );

    expect( submitBtn.prop( 'disabled' ) ).toEqual( false );
  } );

  it( 'clicking submit btn calls handleSubmit once', () => {
    wrapper.simulate( 'submit' );
    expect( props.handleSubmit ).toHaveBeenCalledTimes( 1 );
  } );
} );

describe( '<ProjectDetailsForm />, for video projects', () => {
  let Component;
  let wrapper;

  const videoProps = {
    ...props,
    values: {
      projectTitle: 'Just a test title',
      visibility: 'visibility-12345',
      author: 'author-aidkwi83',
      team: 'team-dfiiad',
      categories: ['category-123'],
      tags: ['tag-123'],
      descPublic: 'public description',
      descInternal: 'internal description',
    },
    config: {
      headline: 'Project Data',
      projectTitle: {
        label: 'Project Title',
        required: true,
      },
      visibility: {
        label: 'Visibility Setting',
        required: true,
      },
      author: {
        label: 'Author',
        required: false,
      },
      team: {
        label: 'Team',
        required: false,
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
    },
  };

  beforeEach( () => {
    Component = <ProjectDetailsForm { ...videoProps } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the UserDropdown', () => {
    const userDropdown = wrapper.find( 'UserDropdown' );

    expect( userDropdown.exists() ).toEqual( true );
  } );

  it( 'does not render the CopyrightDropdown', () => {
    const copyrightDropdown = wrapper.find( 'CopyrightDropdown' );

    expect( copyrightDropdown.exists() ).toEqual( false );
  } );

  it( 'does not render the alt field', () => {
    const altField = wrapper.find( 'FormField#alt' );

    expect( altField.exists() ).toEqual( false );
  } );
} );

describe( '<ProjectDetailsForm />, if props.id has a value', () => {
  let Component;
  let wrapper;

  const newProps = {
    ...props,
    id: 'project-123',
  };

  beforeEach( () => {
    Component = <ProjectDetailsForm { ...newProps } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the TermsConditions', () => {
    const termsConditions = wrapper.find( 'TermsConditions' );

    expect( termsConditions.exists() ).toEqual( false );
  } );

  it( 'does not render the save and upload', () => {
    const submitBtn = wrapper.find( 'Button.edit-project__form--save' );

    expect( submitBtn.exists() ).toEqual( false );
  } );
} );

describe( '<ProjectDetailsForm />, when there is a props.id and required fields are missing values', () => {
  let Component;
  let wrapper;

  const newProps = {
    ...props,
    id: 'project-123',
    errors: {
      projectTitle: 'A project title is required.',
      copyright: 'A copyright setting is required.',
      categories: 'At least 1 category is required.',
    },
    touched: {
      projectTitle: true,
      copyright: true,
      categories: true,
    },
    values: {
      projectTitle: '',
      copyright: '',
      categories: [],
    },
  };

  beforeEach( () => {
    Component = <ProjectDetailsForm { ...newProps } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders an error message for the missing project title', () => {
    const projectTitleField = wrapper.find( 'FormField#projectTitle' );
    const errorMsg = wrapper.find( 'FormField#projectTitle + .error-message' );

    expect( projectTitleField.prop( 'error' ) ).toEqual( true );
    expect( errorMsg.text() ).toEqual( newProps.errors.projectTitle );
  } );

  it( 'renders an error message for the missing copyright value', () => {
    const copyrightDropdown = wrapper.find( 'CopyrightDropdown' );
    const errorMsg = wrapper.find( 'CopyrightDropdown + .error-message' );

    expect( copyrightDropdown.prop( 'error' ) ).toEqual( true );
    expect( errorMsg.text() ).toEqual( newProps.errors.copyright );
  } );

  it( 'renders an error message for the missing categories value(s)', () => {
    const categoriesDropdown = wrapper.find( 'CategoryDropdown' );
    const errorMsg = wrapper.find( 'CategoryDropdown + .error-message' );

    expect( categoriesDropdown.prop( 'error' ) ).toEqual( true );
    expect( errorMsg.text() ).toEqual( newProps.errors.categories );
  } );

  it( 'renders an error message for having over 2 categories values', () => {
    const excessiveCategoriesProps = {
      ...newProps,
      errors: {
        ...newProps.errors,
        categories: 'Maximum of 2 categories can be selected',
      },
      values: {
        ...newProps.values,
        categories: [
          '111', '222', '333',
        ],
      },
    };
    const newComponent = <ProjectDetailsForm { ...excessiveCategoriesProps } />;
    const newWrapper = mount( newComponent );
    const categoriesDropdown = newWrapper.find( 'CategoryDropdown' );
    const errorMsg = newWrapper.find( 'CategoryDropdown + .error-message' );

    expect( categoriesDropdown.prop( 'error' ) ).toEqual( true );
    expect( errorMsg.text() )
      .toEqual( excessiveCategoriesProps.errors.categories );
  } );
} );

describe( '<ProjectDetailsForm />, when there is no props.id and required fields are missing values', () => {
  let Component;
  let wrapper;

  const newProps = {
    ...props,
    errors: {
      termsConditions: 'You have to agree with our Terms of Use!',
    },
    touched: {
      termsConditions: true,
    },
  };

  beforeEach( () => {
    Component = <ProjectDetailsForm { ...newProps } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders an error message for the TermsConditions', () => {
    const termsConditions = wrapper.find( 'TermsConditions' );

    expect( termsConditions.exists() ).toEqual( true );
    expect( termsConditions.prop( 'error' ) ).toEqual( true );
  } );
} );
