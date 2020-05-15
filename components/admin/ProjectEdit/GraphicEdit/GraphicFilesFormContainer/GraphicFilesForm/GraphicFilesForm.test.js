import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';
import GraphicFilesForm from './GraphicFilesForm';

jest.mock(
  'components/admin/ConfirmModalContent/ConfirmModalContent',
  () => function ConfirmModalContent() { return ''; },
);

jest.mock(
  'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup',
  () => function FileRemoveReplaceButtonGroup() { return ''; },
);

jest.mock(
  'components/admin/FileUploadProgressBar/FileUploadProgressBar',
  () => function FileUploadProgressBar() { return ''; },
);

jest.mock(
  'components/admin/FormikAutoSave/FormikAutoSave',
  () => function FormikAutoSave() { return ''; },
);

jest.mock(
  'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown',
  () => function GraphicStyleDropdown() { return ''; },
);

jest.mock(
  'components/admin/dropdowns/LanguageDropdown/LanguageDropdown',
  () => function LanguageDropdown() { return ''; },
);

jest.mock(
  'components/admin/dropdowns/SocialPlatformDropdown/SocialPlatformDropdown',
  () => function SocialPlatformDropdown() { return ''; },
);

const props = {
  errors: {},
  files: [
    {
      id: 'cka5di41430i10720v06c52ic',
      createdAt: '2020-05-13T13:21:56.183Z',
      updatedAt: '2020-05-13T13:25:12.933Z',
      filename: '4_3_Serious_TW.jpg',
      filetype: 'image/jpeg',
      filesize: 297343,
      url: '2020/04/commons.america.gov_ck9laaua62c2o0720577s3jto/4_3_Serious_TW.jpg',
      signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2020/04/commons.america.gov_ck9laaua62c2o0720577s3jto/4_3_Serious_TW.jpg?AWSAccessKeyId=someaccesskey&Expires=1589466970&Signature=thesignature',
      alt: null,
      language: {
        id: 'ck2lzfx710hkq07206thus6pt',
        locale: 'en-us',
        languageCode: 'en',
        displayName: 'English',
        textDirection: 'LTR',
        nativeName: 'English',
        __typename: 'Language',
      },
      dimensions: {
        id: 'cka5di41m30i20720rvqjahzy',
        height: 675,
        width: 1200,
        __typename: 'Dimensions',
      },
      __typename: 'ImageFile',
      title: '4_3_Serious_TW.jpg',
      style: {
        id: 'ck9h3koe426aa0720y421wmk3',
        name: 'Clean',
        __typename: 'GraphicStyle',
      },
      social: [
        {
          id: 'ck9h3m3g626bd07201gh712vk',
          name: 'Twitter',
          __typename: 'SocialPlatform',
        },
      ],
      use: {
        id: 'ck2lzfx510hhj07205mal3e4l',
        name: 'Thumbnail/Cover Image',
        __typename: 'ImageUse',
      },
    },
    {
      id: 'cka5di48r30ig072003dqjffb',
      createdAt: '2020-05-13T13:21:56.467Z',
      updatedAt: '2020-05-13T13:25:12.937Z',
      filename: '4_3_Serious_FB.jpg',
      filetype: 'image/jpeg',
      filesize: 433851,
      url: '2020/04/commons.america.gov_ck9laaua62c2o0720577s3jto/4_3_Serious_FB.jpg',
      signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2020/04/commons.america.gov_ck9laaua62c2o0720577s3jto/4_3_Serious_FB.jpg?AWSAccessKeyId=someaccesskey&Expires=1589466970&Signature=thesignature',
      alt: null,
      language: {
        id: 'ck2lzfx710hkq07206thus6pt',
        locale: 'en-us',
        languageCode: 'en',
        displayName: 'English',
        textDirection: 'LTR',
        nativeName: 'English',
        __typename: 'Language',
      },
      dimensions: {
        id: 'cka5di49730ih0720o1u2m49y',
        height: 1200,
        width: 1200,
        __typename: 'Dimensions',
      },
      __typename: 'ImageFile',
      title: '4_3_Serious_FB.jpg',
      style: {
        id: 'ck9h3kyb326ak0720wkbk01q6',
        name: 'Info/Stat',
        __typename: 'GraphicStyle',
      },
      social: [
        {
          id: 'ck9h3m9bl26bm0720rm69c60s',
          name: 'Facebook',
          __typename: 'SocialPlatform',
        },
      ],
      use: {
        id: 'ck2lzfx510hhj07205mal3e4l',
        name: 'Thumbnail/Cover Image',
        __typename: 'ImageUse',
      },
    },
  ],
  projectId: 'project-123',
  save: jest.fn(),
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
  touched: {},
  values: {
    cka5di41430i10720v06c52ic: {
      id: 'cka5di41430i10720v06c52ic',
      title: '4_3_Serious_TW.jpg',
      language: 'ck2lzfx710hkq07206thus6pt',
      social: ['ck9h3m3g626bd07201gh712vk'],
      style: 'ck9h3koe426aa0720y421wmk3',
    },
    cka5di48r30ig072003dqjffb: {
      id: 'cka5di48r30ig072003dqjffb',
      title: '4_3_Serious_FB.jpg',
      language: 'ck2lzfx710hkq07206thus6pt',
      social: ['ck9h3m9bl26bm0720rm69c60s'],
      style: 'ck9h3kyb326ak0720wkbk01q6',
    },
  },
};

const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';

  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};

describe( '<GraphicFileForm />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let Component;
  let wrapper;
  let graphicsForm;
  let fieldsets;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicFilesForm { ...props } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    graphicsForm = wrapper.find( 'GraphicFilesForm' );
    fieldsets = graphicsForm.find( 'fieldset' );
  } );

  it( 'renders without crashing', () => {
    expect( graphicsForm.exists() ).toEqual( true );
  } );

  it( 'renders with the correct className value', () => {
    const containingDiv = graphicsForm.find( '.graphic-project-graphic-files' );

    expect( containingDiv.exists() ).toEqual( true );
  } );

  it( 'renders the Form with the correct className value', () => {
    const semanticForm = graphicsForm.find( 'Form' );

    expect( semanticForm.exists() ).toEqual( true );
    expect( semanticForm.hasClass( 'form-fields' ) ).toEqual( true );
  } );

  it( 'renders the Confirm modal', () => {
    const confirm = graphicsForm.find( 'Confirm' );
    const content = mount( confirm.prop( 'content' ) );
    const contentMsg = mount( content.prop( 'children' ) );

    expect( confirm.exists() ).toEqual( true );
    expect( confirm.hasClass( 'delete' ) ).toEqual( true );
    expect( confirm.prop( 'open' ) ).toEqual( false );
    expect( content.prop( 'className' ) ).toEqual( 'delete_confirm' );
    expect( content.prop( 'headline' ) )
      .toEqual( 'Are you sure you want to delete this graphic?' );
    expect( contentMsg.name() ).toEqual( 'p' );
    expect( contentMsg.text() )
      .toEqual( 'This graphic will be permanently removed from the Content Commons and any other projects or collections it appears on.' );
  } );

  it( 'clicking the trash icon opens the Confirm modal', () => {
    const replaceBtn = fieldsets.first().find( 'FileRemoveReplaceButtonGroup' );

    // open the modal
    replaceBtn.prop( 'onRemove' )();
    wrapper.update();
    const confirm = wrapper.find( 'Confirm' );

    expect( confirm.prop( 'open' ) ).toEqual( true );
  } );

  it( 'clicking the Confirm modal "No, take me back" button closes the modal', () => {
    const replaceBtn = fieldsets.first().find( 'FileRemoveReplaceButtonGroup' );

    // open the modal
    replaceBtn.prop( 'onRemove' )();
    wrapper.update();
    const confirm = () => wrapper.find( 'Confirm' );

    expect( confirm().prop( 'open' ) ).toEqual( true );

    // close the modal
    confirm().prop( 'onCancel' )();
    wrapper.update();

    expect( confirm().prop( 'open' ) ).toEqual( false );
  } );

  it( 'renders the correct fieldsets', () => {
    expect( fieldsets.length ).toEqual( props.files.length );
    expect( toJSON( fieldsets ) ).toMatchSnapshot();
  } );

  it( 'changing the title field value calls handleOnChange', () => {
    const { id } = props.files[0];
    const titleField = graphicsForm.find( `Input#title-${id}` );
    const e = {};
    const data = {
      name: `${id}.title`,
      value: 'new title',
    };

    titleField.prop( 'onChange' )( e, data );
    expect( props.setFieldValue )
      .toHaveBeenCalledWith( data.name, data.value );
    expect( props.setFieldTouched )
      .toHaveBeenCalledWith( data.name, true, false );
  } );

  it( 'changing the language value calls handleOnChange', () => {
    const { id } = props.files[0];
    const language = graphicsForm.find( `#graphic-style-${id}` );
    const e = {};
    const data = {
      name: `${id}.language`,
      value: '8888888',
    };

    language.prop( 'onChange' )( e, data );
    expect( props.setFieldValue )
      .toHaveBeenCalledWith( data.name, data.value );
    expect( props.setFieldTouched )
      .toHaveBeenCalledWith( data.name, true, false );
  } );

  it( 'changing the graphic style value calls handleOnChange', () => {
    const { id } = props.files[0];
    const style = graphicsForm.find( `#graphic-style-${id}` );
    const e = {};
    const data = {
      name: `${id}.style`,
      value: '8888888',
    };

    style.prop( 'onChange' )( e, data );
    expect( props.setFieldValue )
      .toHaveBeenCalledWith( data.name, data.value );
    expect( props.setFieldTouched )
      .toHaveBeenCalledWith( data.name, true, false );
  } );

  it( 'changing the social platform value calls handleOnChange', () => {
    const { id } = props.files[0];
    const social = graphicsForm.find( `#social-platform-${id}` );
    const e = {};
    const data = {
      name: `${id}.social`,
      value: '8888888',
    };

    social.prop( 'onChange' )( e, data );
    expect( props.setFieldValue )
      .toHaveBeenCalledWith( data.name, data.value );
    expect( props.setFieldTouched )
      .toHaveBeenCalledWith( data.name, true, false );
  } );
} );

describe( '<GraphicFilesForm />, when no files are received', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let Component;
  let wrapper;
  let graphicsForm;

  const newProps = {
    ...props,
    files: [],
  };

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicFilesForm { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    graphicsForm = wrapper.find( 'GraphicFilesForm' );
  } );

  it( 'renders a No Files message', () => {
    const semanticForm = graphicsForm.find( 'Form' );
    const noFilesWrapper = graphicsForm.find( '.no-files' );
    const msg = 'No files to upload';

    expect( semanticForm.exists() ).toEqual( false );
    expect( noFilesWrapper.exists() ).toEqual( true );
    expect( noFilesWrapper.name() ).toEqual( 'p' );
    expect( noFilesWrapper.contains( msg ) ).toEqual( true );
  } );
} );

describe( '<GraphicFilesForm />, when a required field value is missing', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let Component;
  let wrapper;
  let graphicsForm;

  const fileId = props.files[0].id;

  const newProps = {
    ...props,
    errors: {
      [fileId]: {
        language: 'A language is required',
        style: 'A graphic style is required.',
        social: 'A social platform is required.',
      },
    },
    touched: {
      [fileId]: {
        language: true,
        style: true,
        social: true,
      },
    },
    values: {
      ...props.values,
      [fileId]: {
        ...props.values[fileId],
        language: null,
        style: null,
        social: null,
      },
    },
  };

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicFilesForm { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    graphicsForm = wrapper.find( 'GraphicFilesForm' );
  } );

  it( 'renders an error message if there is no language value', () => {
    const languageWrappers = graphicsForm.find( '.language-field' );
    const language = graphicsForm.find( `#language-${fileId}` );
    const msg = newProps.errors[fileId].language;

    expect( languageWrappers.exists() ).toEqual( true );
    expect( language.prop( 'error' ) ).toEqual( true );
    expect( languageWrappers.first().contains( msg ) ).toEqual( true );
  } );

  it( 'renders an error message if there is no graphic style value', () => {
    const styleWrappers = graphicsForm.find( '.graphic-style-field' );
    const style = graphicsForm.find( `#graphic-style-${fileId}` );
    const msg = newProps.errors[fileId].style;

    expect( styleWrappers.exists() ).toEqual( true );
    expect( style.prop( 'error' ) ).toEqual( true );
    expect( styleWrappers.first().contains( msg ) ).toEqual( true );
  } );

  it( 'renders an error message if there is no social platform value', () => {
    const socialWrappers = graphicsForm.find( '.social-platform-field' );
    const social = graphicsForm.find( `#social-platform-${fileId}` );
    const msg = newProps.errors[fileId].social;

    expect( socialWrappers.exists() ).toEqual( true );
    expect( social.prop( 'error' ) ).toEqual( true );
    expect( socialWrappers.first().contains( msg ) ).toEqual( true );
  } );
} );

describe( '<GraphicFilesForm />, when a projectId does not exist', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let Component;
  let wrapper;
  let graphicsForm;
  let fieldsets;

  const fileId = props.files[0].id;

  const newProps = {
    ...props,
    projectId: undefined,
  };

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicFilesForm { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    graphicsForm = wrapper.find( 'GraphicFilesForm' );
    fieldsets = graphicsForm.find( 'fieldset' );
  } );

  it( 'renders a disabled language dropdown', () => {
    const language = graphicsForm.find( `#language-${fileId}` );
    const imgWrapper = fieldsets.find( `.graphic-file-${fileId} > .image-wrapper` );

    expect( language.prop( 'disabled' ) ).toEqual( true );
    expect( imgWrapper.hasClass( 'unavailable' ) ).toEqual( true );
  } );

  it( 'renders a disabled graphic style dropdown', () => {
    const style = graphicsForm.find( `#graphic-style-${fileId}` );
    const imgWrapper = fieldsets.find( `.graphic-file-${fileId} > .image-wrapper` );

    expect( style.prop( 'disabled' ) ).toEqual( true );
    expect( imgWrapper.hasClass( 'unavailable' ) ).toEqual( true );
  } );

  it( 'renders a disabled social platform dropdown', () => {
    const social = graphicsForm.find( `#social-platform-${fileId}` );
    const imgWrapper = fieldsets.find( `.graphic-file-${fileId} > .image-wrapper` );

    expect( social.prop( 'disabled' ) ).toEqual( true );
    expect( imgWrapper.hasClass( 'unavailable' ) ).toEqual( true );
  } );
} );

describe( '<GraphicFilesForm />, when there is a long file name', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let Component;
  let wrapper;
  let graphicsForm;
  let fieldsets;


  const newProps = {
    ...props,
    files: [
      {
        ...props.files[0],
        filename: '4_3_Serious_aieaue_kaienwiz_ke8akcua_aeicaie_eiamwyz_TW.jpg',
      },
    ],
  };

  const { id: fileId, filename } = newProps.files[0];

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicFilesForm { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    graphicsForm = wrapper.find( 'GraphicFilesForm' );
    fieldsets = graphicsForm.find( 'fieldset' );
  } );

  it( 'renders a truncated filename with the full filename visually hidden', () => {
    const imgWrapper = fieldsets.find( `.graphic-file-${fileId} > .image-wrapper` );
    const btn = imgWrapper.find( '.filename.truncated' );
    const visuallyHidden = imgWrapper.find( '.hide-visually' );

    expect( btn.prop( 'tooltip' ) ).toEqual( filename );
    expect( btn.text() ).toEqual( '4_3_Serious_aieaue_k...wyz_TW.jpg' );
    expect( visuallyHidden.text() ).toEqual( filename );
  } );
} );
