import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { categoryData, privacyOptions } from 'components/admin/projects/ProjectEdit/mockData';
import ProjectDataForm from './ProjectDataForm';

const props = {
  handleSubmit: jest.fn(),
  handleChange: jest.fn(),
  videoTitle: '',
  privacyOptions,
  privacySetting: 'anyone',
  authorValue: '',
  ownerValue: '',
  categoryLabel: 'Categories',
  maxCategories: 2,
  categoryOptions: categoryData,
  categoriesValue: [],
  hasExceededMaxCategories: false,
  tagsValue: [],
  publicDescValue: '',
  internalDescValue: '',
  termsConditions: false,
  hasSubmittedData: false,
  hasRequiredData: false
};
const Component = <ProjectDataForm { ...props } />;

describe( '<ProjectDataForm />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'has "edit-project__form project-data" class values', () => {
    const wrapper = shallow( Component );
    expect( wrapper.hasClass( 'edit-project__form project-data' ) )
      .toEqual( true );
  } );

  it( 'submit btn is disabled initially', () => {
    const wrapper = shallow( Component );
    const submitBtn = wrapper.find( '.edit-project__form--save' );
    expect( submitBtn.prop( 'disabled' ) ).toEqual( true );
  } );

  it( 'submit btn is not disabled if required data is complete', () => {
    const newProps = {
      ...props,
      ...{
        videoTitle: 'Test Title',
        privacySetting: 'anyone',
        categoriesValue: ['about-america'],
        termsConditions: true
      }
    };

    const {
      videoTitle,
      privacySetting,
      categoriesValue,
      termsConditions
    } = newProps;

    const categoriesCount = categoriesValue.length;

    const hasRequired = {
      hasRequiredData: !!videoTitle
        && privacySetting
        && categoriesCount > 0
        && categoriesCount <= props.maxCategories
        && termsConditions
    };

    const wrapper = shallow( <ProjectDataForm { ...{ ...newProps, ...hasRequired } } /> );

    const submitBtn = wrapper.find( '.edit-project__form--save' );
    expect( submitBtn.prop( 'disabled' ) ).toEqual( !hasRequired.hasRequiredData );
  } );

  it( 'submit btn is disabled if terms and conditions is unchecked', () => {
    const newProps = {
      ...props,
      ...{
        videoTitle: 'Test Title',
        privacySetting: 'anyone',
        categoriesValue: ['about-america']
      }
    };

    const {
      videoTitle,
      privacySetting,
      categoriesValue,
      termsConditions
    } = newProps;

    const categoriesCount = categoriesValue.length;

    const hasRequired = {
      hasRequiredData: !!videoTitle
        && privacySetting
        && categoriesCount > 0
        && categoriesCount <= props.maxCategories
        && termsConditions
    };

    const wrapper = shallow( <ProjectDataForm { ...{ ...newProps, ...hasRequired } } /> );

    const submitBtn = wrapper.find( '.edit-project__form--save' );
    expect( submitBtn.prop( 'disabled' ) )
      .toEqual( !hasRequired.hasRequiredData );
  } );

  it( 'submit btn is disabled if there is no video title value', () => {
    const newProps = {
      ...props,
      ...{
        privacySetting: 'anyone',
        categoriesValue: ['about-america'],
        termsConditions: true
      }
    };

    const {
      videoTitle,
      privacySetting,
      categoriesValue,
      termsConditions
    } = newProps;

    const categoriesCount = categoriesValue.length;

    const hasRequired = {
      hasRequiredData: !!videoTitle
        && privacySetting
        && categoriesCount > 0
        && categoriesCount <= props.maxCategories
        && termsConditions
    };

    const wrapper = shallow( <ProjectDataForm { ...{ ...newProps, ...hasRequired } } /> );
    const submitBtn = wrapper.find( '.edit-project__form--save' );
    expect( submitBtn.prop( 'disabled' ) )
      .toEqual( !hasRequired.hasRequiredData );
  } );

  it( 'submit btn is disabled if there is no privacy value', () => {
    const newProps = {
      ...props,
      ...{
        videoTitle: 'Test Title',
        categoriesValue: ['about-america'],
        termsConditions: true
      }
    };

    const {
      videoTitle,
      privacySetting,
      categoriesValue,
      termsConditions
    } = newProps;

    const categoriesCount = categoriesValue.length;

    const hasRequired = {
      hasRequiredData: !!videoTitle
        && privacySetting
        && categoriesCount > 0
        && categoriesCount <= props.maxCategories
        && termsConditions
    };

    const wrapper = shallow( <ProjectDataForm { ...{ ...newProps, ...hasRequired } } /> );

    const submitBtn = wrapper.find( '.edit-project__form--save' );
    expect( submitBtn.prop( 'disabled' ) ).toEqual( !hasRequired.hasRequiredData );
  } );

  it( 'submit btn is disabled if there is (are) no category value(s)', () => {
    const newProps = {
      ...props,
      ...{
        videoTitle: 'Test Title',
        privacySetting: 'anyone',
        termsConditions: true
      }
    };

    const {
      videoTitle,
      privacySetting,
      categoriesValue,
      termsConditions
    } = newProps;

    const categoriesCount = categoriesValue.length;

    const hasRequired = {
      hasRequiredData: !!videoTitle
        && privacySetting
        && categoriesCount > 0
        && categoriesCount <= props.maxCategories
        && termsConditions
    };

    const wrapper = shallow( <ProjectDataForm { ...{ ...newProps, ...hasRequired } } /> );

    const submitBtn = wrapper.find( '.edit-project__form--save' );
    expect( submitBtn.prop( 'disabled' ) ).toEqual( !hasRequired.hasRequiredData );
  } );

  it( 'submit btn is disabled if the number of categories selected exceeds the maximum allowed', () => {
    const newProps = {
      ...props,
      ...{
        videoTitle: 'Test Title',
        privacySetting: 'anyone',
        categoriesValue: [
          'about-america', 'economic-issues', 'education'
        ],
        termsConditions: true
      }
    };

    const {
      videoTitle,
      privacySetting,
      categoriesValue,
      termsConditions
    } = newProps;

    const categoriesCount = categoriesValue.length;

    const hasRequired = {
      hasRequiredData: !!videoTitle
        && privacySetting
        && categoriesCount > 0
        && categoriesCount <= props.maxCategories
        && termsConditions
    };

    const wrapper = shallow( <ProjectDataForm { ...{ ...newProps, ...hasRequired } } /> );

    const submitBtn = wrapper.find( '.edit-project__form--save' );
    expect( submitBtn.prop( 'disabled' ) ).toEqual( !hasRequired.hasRequiredData );
  } );

  it( 'terms & condition checkbox has error state if unchecked', () => {
    const wrapper = shallow( Component );
    const titleField = wrapper.find( '#terms-conditions' );
    expect( titleField.prop( 'error' ) )
      .toEqual( !props.termsConditions );
  } );

  it( 'terms & condition checkbox does not have error state if checked', () => {
    const newProps = {
      ...props,
      ...{ termsConditions: true }
    };
    const wrapper = shallow( <ProjectDataForm { ...newProps } /> );
    const titleField = wrapper.find( '#terms-conditions' );
    expect( titleField.prop( 'error' ) )
      .toEqual( !newProps.termsConditions );
  } );

  it( 'title field has error state if no value is entered', () => {
    const wrapper = shallow( Component );
    const titleField = wrapper.find( '#video-title' );
    expect( titleField.prop( 'error' ) )
      .toEqual( !props.videoTitle );
  } );

  it( 'title field does not have error state if a value is entered', () => {
    const newProps = {
      ...props,
      ...{ videoTitle: 'Test Title' }
    };
    const wrapper = shallow( <ProjectDataForm { ...newProps } /> );
    const titleField = wrapper.find( '#video-title' );
    expect( titleField.prop( 'error' ) )
      .toEqual( !newProps.videoTitle );
  } );

  it( 'privacy field has error state if no value is entered', () => {
    const newProps = {
      ...props,
      ...{ privacySetting: '' }
    };
    const wrapper = shallow( <ProjectDataForm { ...newProps } /> );
    const privacyField = wrapper.find( '#privacy-setting' );
    expect( privacyField.prop( 'error' ) )
      .toEqual( !newProps.privacySetting );
  } );

  it( 'privacy field does not have error state if a value is entered', () => {
    const wrapper = shallow( Component );
    const privacyField = wrapper.find( '#privacy-setting' );
    expect( privacyField.prop( 'error' ) )
      .toEqual( !props.privacySetting );
  } );

  it( 'category field has error state if no value is entered', () => {
    const wrapper = shallow( Component );
    const categoryField = wrapper.find( '#video-categories' );
    expect( categoryField.prop( 'error' ) )
      .toEqual( !props.categoriesValue.length > 0 );
  } );

  it( 'category field does not have error state if a value is entered', () => {
    const newProps = {
      ...props,
      ...{ categoriesValue: ['about-america'] }
    };
    const wrapper = shallow( <ProjectDataForm { ...newProps } /> );
    const categoryField = wrapper.find( '#video-categories' );
    expect( categoryField.prop( 'error' ) )
      .toEqual( !newProps.categoriesValue.length > 0 );
  } );

  it( 'category field has error state if the number of categories exceeds maximum allowed', () => {
    const newProps = {
      ...props,
      ...{
        categoriesValue: [
          'about-america', 'economic-issues', 'education'
        ]
      }
    };

    const hasError = {
      hasExceededMaxCategories: newProps.categoriesValue.length > newProps.maxCategories
    };

    const wrapper = shallow(
      <ProjectDataForm { ...{ ...newProps, ...hasError } } />
    );
    const categoryField = wrapper.find( '#video-categories' );
    expect( categoryField.prop( 'error' ) )
      .toEqual( hasError.hasExceededMaxCategories );
  } );

  it( 'category field does not have error state if the number of categories does not exceed maximum allowed', () => {
    const newProps = {
      ...props,
      ...{
        categoriesValue: ['about-america', 'economic-issues']
      }
    };

    const hasError = {
      hasExceededMaxCategories: newProps.categoriesValue.length > newProps.maxCategories
    };

    const wrapper = shallow(
      <ProjectDataForm { ...{ ...newProps, ...hasError } } />
    );
    const categoryField = wrapper.find( '#video-categories' );
    expect( categoryField.prop( 'error' ) )
      .toEqual( hasError.hasExceededMaxCategories );
  } );

  it( 'clicking submit btn calls `handleSubmit` once', () => {
    const wrapper = shallow( Component );
    wrapper.simulate( 'submit' );
    expect( props.handleSubmit ).toHaveBeenCalledTimes( 1 );
  } );

  it( 'entering field values calls `handleChange`', () => {
    const wrapper = shallow( Component );
    const fields = [
      'video-title',
      'privacy-setting',
      'author',
      'owner',
      'video-categories',
      'video-tags',
      'public-description',
      'internal-description',
      'terms-conditions'
    ];

    fields.forEach( field => {
      const elem = wrapper.find( `#${field}` );
      elem.simulate( 'change' );
      expect( props.handleChange ).toHaveBeenCalled();
    } );
  } );
} );
