import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import GraphicFilesFormContainer from './GraphicFilesFormContainer';

jest.mock(
  'components/admin/ProjectEdit/GraphicEdit/AddFilesSectionHeading/AddFilesSectionHeading',
  () => function AddFilesSectionHeading() { return ''; }
);

jest.mock(
  'components/admin/ProjectEdit/GraphicEdit/GraphicFilesFormContainer/GraphicFilesForm/GraphicFilesForm',
  () => function GraphicFilesForm() { return ''; }
);

const props = {
  projectId: 'project-123',
  files: [
    {
      id: 'ck2m096f80rq70720nsnylh27',
      createdAt: '2019-11-05T15:25:30.462Z',
      updatedAt: '2020-05-04T17:16:53.930Z',
      filename: 'Mexico_City_long_long_asiasd_lasdf_kljiemx_iskei_jlks_askljdf_asdiweoncx_xzxziwe.jpg',
      filetype: 'image/jpeg',
      filesize: 1030591,
      url: '2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/mexico_city_1.jpg',
      signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/mexico_city_1.jpg?AWSAccessKeyId=someaccesskeyid&Expires=1588622164&Signature=thesignature',
      alt: null,
      use: {
        id: 'ck2lzfx510hhj07205mal3e4l',
        name: 'Thumbnail/Cover Image',
        __typename: 'ImageUse'
      },
      language: {
        id: 'ck2lzfx710hkq07206thus6pt',
        locale: 'en-us',
        languageCode: 'en',
        displayName: 'English',
        textDirection: 'LTR',
        nativeName: 'English',
        __typename: 'Language'
      },
      __typename: 'ImageFile',
      title: 'Mexico_City_long_long_asiasd_lasdf_kljiemx_iskei_jlks_askljdf_asdiweoncx_xzxziwe.jpg',
      social: [
        {
          id: 'ck9h3meu626bw07201o36tapc',
          name: 'Instagram',
          __typename: 'SocialPlatform'
        }
      ],
      style: {
        id: 'ck9h3l7zn26au0720ialhqtg4',
        name: 'Quote',
        __typename: 'GraphicStyle'
      }
    },
    {
      id: 'ck2maluky0s5z0720a2dgkisd',
      createdAt: '2019-11-05T20:15:17.892Z',
      updatedAt: '2020-05-04T17:16:55.720Z',
      filename: 'Mexico City 1.jpg',
      filetype: 'image/jpeg',
      filesize: 1030591,
      url: '2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/mexico_city_1.jpg',
      signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/mexico_city_1.jpg?AWSAccessKeyId=someaccesskeyid&Expires=1588622164&Signature=thesignature',
      alt: null,
      use: {
        id: 'ck2lzfx510hhj07205mal3e4l',
        name: 'Thumbnail/Cover Image',
        __typename: 'ImageUse'
      },
      language: {
        id: 'ck2lzfx7m0hl50720y9oqzyqz',
        locale: 'ja',
        languageCode: 'ja',
        displayName: 'Japanese',
        textDirection: 'LTR',
        nativeName: '日本語',
        __typename: 'Language'
      },
      __typename: 'ImageFile',
      title: 'Mexico City 1.jpg',
      social: [
        {
          id: 'ck9h3naq526cp0720i4u3uqlv',
          name: 'WhatsApp',
          __typename: 'SocialPlatform'
        }
      ],
      style: {
        id: 'ck9h3kyb326ak0720wkbk01q6',
        name: 'Info/Stat',
        __typename: 'GraphicStyle'
      }
    }
  ],
  handleAddFiles: jest.fn(),
  setIsFormValid: jest.fn(),
  updateNotification: jest.fn()
};

describe( '<GraphicFilesFormContainer />', () => {
  let Component;
  let wrapper;
  let formContainer;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicFilesFormContainer { ...props } />
      </MockedProvider>
    );
    wrapper = mount( Component );
    formContainer = wrapper.find( 'GraphicFilesFormContainer' );
  } );

  const initialValues = props.files.reduce( ( acc, file ) => {
    const {
      id, filename, language, social, style, title
    } = file;

    const socialPlatforms = social
      ? social.map( platform => platform.id )
      : [];

    acc[id] = {
      id,
      title: title || filename,
      language: language?.id || '',
      social: socialPlatforms,
      style: style?.id || ''
    };

    return acc;
  }, {} );

  it( 'renders without crashing', () => {
    expect( formContainer.exists() ).toEqual( true );
  } );

  it( 'receives the correct projectId', () => {
    expect( formContainer.prop( 'id' ) ).toEqual( props.id );
  } );

  it( 'receives the correct files', () => {
    expect( formContainer.prop( 'files' ) ).toEqual( props.files );
  } );

  it( 'renders the correct div className value', () => {
    const div = wrapper.find( 'div.graphic-files-form-container' );

    expect( div.exists() ).toEqual( true );
  } );

  it( 'renders the AddFilesSectionHeading', () => {
    const heading = wrapper.find( 'AddFilesSectionHeading' );

    expect( heading.exists() ).toEqual( true );
    expect( heading.prop( 'projectId' ) ).toEqual( props.projectId );
    expect( heading.prop( 'title' ) ).toEqual( 'Graphics in Project' );
    expect( heading.prop( 'acceptedFileTypes' ) )
      .toEqual( 'image/gif, image/jpeg, image/png' );
  } );

  it( 'renders the Formik component', () => {
    const formik = wrapper.find( 'Formik' );

    expect( formik.exists() ).toEqual( true );
    expect( formik.prop( 'initialValues' ) ).toEqual( initialValues );
  } );

  it( 'renders the GraphicFilesForm component', () => {
    const graphicFilesForm = wrapper.find( 'GraphicFilesForm' );

    expect( graphicFilesForm.exists() ).toEqual( true );
    expect( graphicFilesForm.prop( 'projectId' ) ).toEqual( props.projectId );
    expect( typeof graphicFilesForm.prop( 'save' ) ).toEqual( 'function' );
    expect( graphicFilesForm.prop( 'save' ).name ).toEqual( 'save' );
    expect( graphicFilesForm.prop( 'files' ) ).toEqual( props.files );
    expect( graphicFilesForm.prop( 'initialValues' ) ).toEqual( initialValues );
    expect( graphicFilesForm.prop( 'values' ) ).toEqual( initialValues );
  } );
} );

