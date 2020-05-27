import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { formatBytes, truncateAndReplaceStr } from 'lib/utils';
import { mocks, props } from './mocks';
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

const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';

  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};

describe( '<GraphicFilesForm />', () => {
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
      <MockedProvider mocks={ mocks } addTypename>
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

  it( 'clicking the Confirm modal "Yes, delete forever" button', () => {
    const replaceBtn = fieldsets.first().find( 'FileRemoveReplaceButtonGroup' );

    // open the modal
    replaceBtn.prop( 'onRemove' )();
    wrapper.update();
    const confirm = () => wrapper.find( 'Confirm' );

    expect( confirm().prop( 'open' ) ).toEqual( true );

    // confirm deletion
    const deleteConfirmTest = async done => {
      confirm().prop( 'onConfirm' )();
      await wait( 4 ); // wait for mutation to resolve
      wrapper.update();

      // handleReset is called upon successful deletion
      expect( confirm().prop( 'open' ) ).toEqual( false );
      done();
    };

    deleteConfirmTest();
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
      <MockedProvider mocks={ mocks } addTypename>
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
      <MockedProvider mocks={ mocks } addTypename>
        <GraphicFilesForm { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    graphicsForm = wrapper.find( 'GraphicFilesForm' );
  } );

  it( 'renders FormikAutoSave since fields are touched', () => {
    const formikAutoSave = graphicsForm.find( 'FormikAutoSave' );

    expect( formikAutoSave.exists() ).toEqual( true );
    expect( typeof formikAutoSave.prop( 'save' ) ).toEqual( 'function' );
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

  const newProps = {
    ...props,
    projectId: undefined,
    files: [
      {
        id: 'de71e989-5701-4d28-ad1d-9fb152016ab7',
        name: '4_3_Serious_FB.jpg',
        loaded: 0,
        input: {
          dataUrl: 'the-data-url',
          name: '4_3_Serious_FB.jpg',
          size: 433851,
          __typename: 'LocalInputFile',
        },
        language: 'ck2lzfx710hkq07206thus6pt',
        style: 'ck9h3kyb326ak0720wkbk01q6',
        social: ['ck9h3m9bl26bm0720rm69c60s', 'ck9h3meu626bw07201o36tapc'],
        __typename: 'LocalImageFile',
      },
      {
        id: '727a755c-8274-4df5-8417-f7720c06b6eb',
        name: '4_3_Serious_TW.jpg',
        loaded: 0,
        input: {
          dataUrl: 'the-data-url',
          name: '4_3_Serious_TW.jpg',
          size: 297343,
          __typename: 'LocalInputFile',
        },
        language: 'ck2lzfx710hkq07206thus6pt',
        style: 'ck9h3ka3o269y0720t7wzp5uq',
        social: ['ck9h3m3g626bd07201gh712vk'],
        __typename: 'LocalImageFile',
      },
    ],
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

  it( 'renders a disabled graphic title field', () => {
    const titleFields = graphicsForm.find( 'input[id^="title-"]' );

    titleFields.forEach( ( field, i ) => {
      const { id, input } = newProps.files[i];
      const imgWrapper = fieldsets.find( `.graphic-file-${id} > .image-wrapper` );

      expect( field.prop( 'name' ) ).toEqual( `${id}.title` );
      expect( field.prop( 'value' ) ).toEqual( input.name );
      expect( field.prop( 'disabled' ) ).toEqual( true );
      expect( imgWrapper.hasClass( 'unavailable' ) ).toEqual( true );
    } );
  } );

  it( 'renders a disabled language dropdown', () => {
    const langDropdowns = graphicsForm.find( '[id^="language-"]' );

    langDropdowns.forEach( ( field, i ) => {
      const { id, language } = newProps.files[i];
      const imgWrapper = fieldsets.find( `.graphic-file-${id} > .image-wrapper` );

      expect( field.prop( 'name' ) ).toEqual( `${id}.language` );
      expect( field.prop( 'value' ) ).toEqual( language );
      expect( field.prop( 'disabled' ) ).toEqual( true );
      expect( imgWrapper.hasClass( 'unavailable' ) ).toEqual( true );
    } );
  } );

  it( 'renders a disabled graphic style dropdown', () => {
    const styleFields = graphicsForm.find( '[id^="graphic-style-"]' );

    styleFields.forEach( ( field, i ) => {
      const { id, style } = newProps.files[i];
      const imgWrapper = fieldsets.find( `.graphic-file-${id} > .image-wrapper` );

      expect( field.prop( 'name' ) ).toEqual( `${id}.style` );
      expect( field.prop( 'value' ) ).toEqual( style );
      expect( field.prop( 'disabled' ) ).toEqual( true );
      expect( imgWrapper.hasClass( 'unavailable' ) ).toEqual( true );
    } );
  } );

  it( 'renders a disabled social platform dropdown', () => {
    const socialFields = graphicsForm.find( '[id^="social-platform-"]' );

    socialFields.forEach( ( field, i ) => {
      const { id, social } = newProps.files[i];
      const imgWrapper = fieldsets.find( `.graphic-file-${id} > .image-wrapper` );

      expect( field.prop( 'name' ) ).toEqual( `${id}.social` );
      expect( field.prop( 'value' ) ).toEqual( social );
      expect( field.prop( 'disabled' ) ).toEqual( true );
      expect( imgWrapper.hasClass( 'unavailable' ) ).toEqual( true );
    } );
  } );

  it( 'renders the filename correctly', () => {
    const filenames = graphicsForm.find( '.filename' );

    filenames.forEach( ( filename, i ) => {
      const inputName = newProps.files[i].input.name;

      expect( filename.contains( inputName ) ).toEqual( true );
    } );
  } );

  it( 'renders the filesize correctly', () => {
    const filesizes = graphicsForm.find( '.filesize' );

    filesizes.forEach( ( filesize, i ) => {
      const inputSize = formatBytes( newProps.files[i].input.size, 1 );

      expect( filesize.text() ).toEqual( inputSize );
    } );
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

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ mocks } addTypename>
        <GraphicFilesForm { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    graphicsForm = wrapper.find( 'GraphicFilesForm' );
    fieldsets = graphicsForm.find( 'fieldset' );
  } );

  it( 'renders a truncated filename with the full filename visually hidden', () => {
    fieldsets.forEach( ( fieldset, i ) => {
      const { filename } = newProps.files[i];
      const imgWrapper = fieldset.find( '.image-wrapper' );
      const btn = imgWrapper.find( '.filename.truncated' );
      const visuallyHidden = imgWrapper.find( '.hide-visually' );
      const displayName = filename?.length > 30
        ? truncateAndReplaceStr( filename, 20, 10 )
        : filename;

      expect( btn.prop( 'tooltip' ) ).toEqual( filename );
      expect( btn.text() ).toEqual( displayName );
      expect( visuallyHidden.text() ).toEqual( filename );
    } );
  } );
} );
