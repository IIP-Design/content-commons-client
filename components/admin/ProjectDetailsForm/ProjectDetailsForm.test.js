import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ProjectDetailsForm from './ProjectDetailsForm';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url'
  }
} ) );

jest.mock(
  'components/admin/FormikAutoSave/FormikAutoSave',
  () => function FormikAutoSave() { return ''; }
);

jest.mock(
  'components/admin/TermsConditions/TermsConditions',
  () => function TermsConditions() { return ''; }
);

jest.mock(
  'components/admin/dropdowns/TagDropdown/TagDropdown',
  () => function TagDropdown() { return ''; }
);

jest.mock(
  'components/admin/dropdowns/UserDropdown/UserDropdown',
  () => function UserDropdown() { return ''; }
);

jest.mock(
  'components/admin/dropdowns/CategoryDropdown/CategoryDropdown',
  () => function CategoryDropdown() { return ''; }
);

jest.mock(
  'components/admin/dropdowns/CopyrightDropdown/CopyrightDropdown',
  () => function CopyrightDropdown() { return ''; }
);

jest.mock(
  'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown',
  () => function VisibilityDropdown() { return ''; }
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
    alt: 'some alt text'
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
      required: true
    },
    visibility: {
      label: 'Visibility Setting',
      required: true
    },
    team: {
      label: 'Source',
      required: false
    },
    copyright: {
      label: 'Copyright',
      required: true
    },
    categories: {
      label: 'Categories',
      required: true
    },
    tags: {
      label: 'Tags',
      required: false
    },
    descPublic: {
      label: 'Public Description',
      required: false
    },
    descInternal: {
      label: 'Internal Description',
      required: false
    },
    alt: {
      label: 'Alt (Alternative) Text',
      required: false
    }
  }
};

describe( '<ProjectDetailsForm />', () => {
  const Component = <ProjectDetailsForm { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'has "edit-project__form project-data" class values', () => {
    const wrapper = mount( Component );
    const form = wrapper.find( 'Form' );

    expect( form.hasClass( 'edit-project__form project-data' ) )
      .toEqual( true );
  } );

  it( 'submit btn is disabled initially', () => {
    const wrapper = mount( Component );
    const submitBtn = wrapper.find( 'button.edit-project__form--save' );

    expect( submitBtn.prop( 'disabled' ) ).toEqual( true );
  } );

  it.skip( 'submit btn is not disabled if touched or isValid', () => {
    const newProps = {
      ...props,
      touched: {
        projectTitle: true,
        termsConditions: true,
        categories: true,
        copyright: true
      },
      dirty: true
    };

    const wrapper = mount( <ProjectDetailsForm { ...newProps } /> );
    const submitBtn = wrapper.find( 'button.edit-project__form--save' );

    expect( submitBtn.prop( 'disabled' ) ).toEqual( false );
  } );

  it( 'clicking submit btn calls `handleSubmit` once', () => {
    const wrapper = mount( Component );

    wrapper.simulate( 'submit' );
    expect( props.handleSubmit ).toHaveBeenCalledTimes( 1 );
  } );
} );
