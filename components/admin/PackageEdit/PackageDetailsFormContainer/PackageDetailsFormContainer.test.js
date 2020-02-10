import { mount } from 'enzyme';
import { MockedProvider, wait } from '@apollo/react-testing';
import { AWS_URL, AWS_SIGNED_URL_QUERY_STRING } from 'components/admin/PackageEdit/PackageFiles/mocks';
import { UPDATE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';
import PackageDetailsFormContainer from './PackageDetailsFormContainer';

jest.mock(
  'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsForm/PackageDetailsForm',
  () => function PackageDetailsForm() { return ''; }
);

const id = 'test-123';
const english = {
  __typename: 'Language',
  id: 'ck2lzfx710hkq07206thus6pt',
  languageCode: 'en',
  locale: 'en-us',
  textDirection: 'LTR',
  displayName: 'English',
  nativeName: 'English'
};

const image = {
  __typename: 'ImageFile',
  createdAt: '2019-11-12T13:01:01.906Z',
  updatedAt: '2019-11-12T13:01:01.906Z',
  language: english,
  filename: 'image.png',
  filetype: 'png',
  filesize: 35000,
  visibility: 'PUBLIC',
  url: `daily_guidance/2020/01/commons.america.gov_${id}/image.png`,
  signedUrl: `${AWS_URL}/2020/01/${id}/image.png${AWS_SIGNED_URL_QUERY_STRING}`,
  alt: 'thumbnail of guidance document',
  use: {
    __typename: 'ImageUse',
    id: 'ck2lzfx510hhj07205mal3e4l',
    name: 'Thumbnail/Cover Image'
  }
};

const mocks = [
  {
    request: {
      query: UPDATE_PACKAGE_MUTATION,
      variables: {
        data: {
          title: 'new title',
          type: 'DAILY_GUIDANCE',
          documents: {
            update: [
              {
                data: {
                  title: 'Lesotho National Day',
                  visibility: 'INTERNAL',
                  use: {
                    connect: {
                      id: 'ck2wbvj7u10lo07207aa55qmz'
                    }
                  },
                  bureaus: {},
                  tags: {}
                },
                where: {
                  id: '1asd'
                }
              },
              {
                data: {
                  title: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event',
                  visibility: 'INTERNAL',
                  use: {
                    connect: {
                      id: 'ck2wbvj7u10lo07207aa55qmz'
                    }
                  },
                  bureaus: {},
                  tags: {}
                },
                where: {
                  id: '2sdf'
                }
              }
            ]
          }
        },
        where: { id }
      }
    },
    result: {
      data: {
        updatePackage: {
          __typename: 'Package',
          id,
          title: 'new title',
          createdAt: '2020-01-28T15:42:06.826Z',
          updatedAt: '2020-02-06T12:43:31.110Z',
          publishedAt: '',
          type: 'DAILY_GUIDANCE',
          assetPath: `daily_guidance/2020/01/commons.america.gov_${id}`,
          desc: null,
          status: 'DRAFT',
          visibility: 'INTERNAL',
          author: {
            __typename: 'User',
            id: 'ck2m042xo0rnp0720nb4gxjix',
            firstName: 'Edwin',
            lastName: 'Mah'
          },
          team: {
            __typename: 'Team',
            id: 'ck2qgfbku0ubh0720iwhkvuyn',
            name: 'GPA Press Office'
          },
          categories: [],
          tags: [],
          documents: [
            {
              __typename: 'DocumentFile',
              id: '1asd',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language: english,
              title: 'Lesotho National Day',
              filename: 'Lesotho National Day.docx',
              filetype: 'Statement',
              filesize: 25000,
              status: 'DRAFT',
              content: {
                __typename: 'DocumentConversionFormat',
                id: 'ccc1',
                rawText: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
                html: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
                markdown: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.'
              },
              url: `2019/11/${id}/lesotho_national_day.docx`,
              signedUrl: `${AWS_URL}/2019/11/${id}/lesotho_national_day.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th1',
                  filename: 'lesotho_national_day.png',
                  url: `2019/11/${id}/lesotho_national_day.png`,
                  signedUrl: `${AWS_URL}/2019/11/${id}/lesotho_national_day.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: {
                __typename: 'DocumentUse',
                id: 'ck2wbvj7u10lo07207aa55qmz',
                name: 'Media Note'
              },
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              __typename: 'DocumentFile',
              id: '2sdf',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language: english,
              title: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event',
              filename: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event.docx',
              filetype: 'Media Note',
              filesize: 25000,
              status: 'DRAFT',
              content: {
                __typename: 'DocumentConversionFormat',
                id: 'ccc1',
                rawText: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
                html: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
                markdown: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.'
              },
              url: `2019/11/${id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.docx`,
              signedUrl: `${AWS_URL}/2019/11/${id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th2',
                  filename: 'us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png',
                  url: `2019/11/${id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png`,
                  signedUrl: `${AWS_URL}/2019/11/${id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: {
                __typename: 'DocumentUse',
                id: 'ck2wbvj7u10lo07207aa55qmz',
                name: 'Media Note'
              },
              bureaus: [],
              categories: [],
              tags: []
            },
          ]
        }
      }
    }
  }
];

const props = {
  id,
  children: <div>just another child node</div>,
  setIsDirty: jest.fn(),
  pkg: {
    id,
    title: 'Guidance Package 01-28-20',
    type: 'DAILY_GUIDANCE',
    documents: mocks[0].result.data.updatePackage.documents
  }
};

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
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

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    const formContainer = wrapper.find( 'PackageDetailsFormContainer' );

    expect( formContainer.exists() ).toEqual( true );
  } );

  it( 'renders Formik component', () => {
    const wrapper = mount( Component );
    const formik = wrapper.find( 'Formik' );

    expect( formik.exists() ).toEqual( true );
  } );

  it( 'Formik receives the correct initialValues', () => {
    const wrapper = mount( Component );
    const formik = wrapper.find( 'Formik' );
    const { pkg } = props;
    const fileValues = pkg.documents.reduce( ( acc, file ) => {
      const {
        bureaus, title, tags, use, visibility
      } = file;
      return {
        ...acc,
        [file.id]: {
          id: file.id,
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

  it( 'Formik has enableReinitialize prop', () => {
    const wrapper = mount( Component );
    const formik = wrapper.find( 'Formik' );

    expect( formik.prop( 'enableReinitialize' ) ).toEqual( true );
  } );

  it( 'renders PackageDetailsForm and passes correct props', () => {
    const wrapper = mount( Component );
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
      'pkg',
      'save'
    ];

    expect( detailsForm.exists() ).toEqual( true );
    expect( Object.keys( detailsForm.props() ) ).toEqual( passedProps );
    expect( detailsForm.prop( 'save' ).name ).toEqual( 'save' );
    expect( typeof detailsForm.prop( 'save' ) ).toEqual( 'function' );
  } );

  it( 'renders Notification but is not shown initially', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( true );
    expect( notification.prop( 'show' ) ).toEqual( false );
    expect( notification.prop( 'msg' ) ).toEqual( 'Changes saved' );
  } );

  it( 'renders Notification and is shown on form save', done => {
    const wrapper = mount( Component );

    const notification = () => wrapper.find( 'Notification' );
    const detailsForm = wrapper.find( 'PackageDetailsForm' );

    // not shown initially
    expect( notification().exists() ).toEqual( true );
    expect( notification().prop( 'show' ) ).toEqual( false );

    const test = async () => {
      const values = {
        title: 'new title',
        type: 'DAILY_GUIDANCE',
        termsConditions: false,
        '1asd': {
          id: '1asd',
          title: 'Lesotho National Day',
          visibility: 'INTERNAL',
          use: 'ck2wbvj7u10lo07207aa55qmz',
          bureaus: [],
          tags: []
        },
        '2sdf': {
          id: '2sdf',
          title: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event',
          visibility: 'INTERNAL',
          use: 'ck2wbvj7u10lo07207aa55qmz',
          bureaus: [],
          tags: []
        }
      };
      const prevValues = {
        title: 'Guidance Package 01-28-20',
        type: 'DAILY_GUIDANCE',
        termsConditions: false,
        '1asd': {
          id: '1asd',
          title: 'Lesotho National Day',
          visibility: 'INTERNAL',
          use: 'ck2wbvj7u10lo07207aa55qmz',
          bureaus: [],
          tags: []
        },
        '2sdf': {
          id: '2sdf',
          title: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event',
          visibility: 'INTERNAL',
          use: 'ck2wbvj7u10lo07207aa55qmz',
          bureaus: [],
          tags: []
        }
      };

      await detailsForm.prop( 'save' )( values, prevValues );
      wrapper.update();

      // shown
      expect( props.setIsDirty ).toHaveBeenCalledWith( true );
      expect( notification().prop( 'show' ) ).toEqual( true );
      done();
    };

    test();
  } );
} );
