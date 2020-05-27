import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import { act } from 'react-dom/test-utils';
import GraphicSupportFiles from './GraphicSupportFiles';

jest.mock(
  'components/admin/ConfirmModalContent/ConfirmModalContent',
  () => function ConfirmModalContent() { return ''; },
);

jest.mock(
  'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup',
  () => function FileRemoveReplaceButtonGroup() { return ''; },
);

jest.mock(
  'components/popups/IconPopup/IconPopup',
  () => function IconPopup() { return ''; },
);

const props = {
  projectId: 'project-123',
  headline: 'editable files',
  helperText: 'Original files that may be edited and adapted as needed for reuse.',
  files: [
    {
      id: 'ck9jtuqhy292w07200tfpbkju',
      createdAt: '2020-04-28T11:28:43.173Z',
      updatedAt: '2020-05-06T12:04:17.325Z',
      filename: 's-secure-rights_english.psd',
      filetype: 'image/vnd.adobe.photoshop',
      filesize: 509000,
      url: null,
      language: {
        id: 'ck2lzfx710hkq07206thus6pt',
        locale: 'en-us',
        languageCode: 'en',
        displayName: 'English',
        textDirection: 'LTR',
        nativeName: 'English',
        __typename: 'Language',
      },
      use: null,
      __typename: 'SupportFile',
    },
    {
      id: 'ck9jtsbvz291i0720by3crdcc',
      createdAt: '2020-04-28T11:26:50.874Z',
      updatedAt: '2020-05-06T12:04:52.123Z',
      filename: 's-secure-rights_shell.png',
      filetype: 'image/png',
      filesize: 29000,
      url: null,
      language: {
        id: 'ck2lzfx710hkq07206thus6pt',
        locale: 'en-us',
        languageCode: 'en',
        displayName: 'English',
        textDirection: 'LTR',
        nativeName: 'English',
        __typename: 'Language',
      },
      use: null,
      __typename: 'SupportFile',
    },
  ],
  updateNotification: jest.fn(),
};

describe( '<GraphicSupportFiles />, for editable files', () => {
  let Component;
  let wrapper;
  let listContainer;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename={ false }>
        <GraphicSupportFiles { ...props } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    listContainer = wrapper.find( 'GraphicSupportFiles' );
  } );

  it( 'renders without crashing', () => {
    expect( listContainer.exists() ).toEqual( true );
  } );

  it( 'renders with the correct className values', () => {
    const containingDiv = listContainer.find( '.graphic-project-support-files' );

    expect( containingDiv.exists() ).toEqual( true );
    expect( containingDiv.hasClass( props.headline.replace( ' ', '-' ) ) )
      .toEqual( true );
  } );

  it( 'renders with the list-heading & title', () => {
    const listHeading = listContainer.find( '.list-heading' );
    const title = listContainer.find( '.list-heading > .title' );

    expect( listHeading.exists() ).toEqual( true );
    expect( title.exists() ).toEqual( true );
    expect( title.name() ).toEqual( 'h3' );
    expect( title.text() ).toEqual( props.headline );
  } );

  it( 'renders the IconPopup', () => {
    const iconPopup = listContainer.find( '.list-heading > IconPopup' );

    expect( iconPopup.exists() ).toEqual( true );
    expect( iconPopup.props() ).toEqual( {
      message: props.helperText,
      iconSize: 'small',
      iconType: 'info circle',
      popupSize: 'mini',
    } );
  } );

  it( 'renders the Confirm modal', () => {
    const confirm = listContainer.find( 'Confirm' );
    const content = mount( confirm.prop( 'content' ) );

    expect( confirm.exists() ).toEqual( true );
    expect( confirm.hasClass( 'delete' ) ).toEqual( true );
    expect( confirm.prop( 'open' ) ).toEqual( false );
    expect( content.prop( 'className' ) ).toEqual( 'delete_confirm' );
    expect( content.prop( 'headline' ) )
      .toEqual( 'Are you sure you want to delete this file?' );
  } );

  it( 'clicking the remove icon opens the Confirm modal', () => {
    const replaceBtn = listContainer
      .find( 'FileRemoveReplaceButtonGroup' ).first();

    // open the modal
    act( () => {
      replaceBtn.prop( 'onRemove' )();
    } );
    wrapper.update();
    const confirm = wrapper.find( 'Confirm' );

    expect( confirm.prop( 'open' ) ).toEqual( true );
  } );

  it( 'clicking the Confirm modal "No, take me back" button closes the modal', () => {
    const replaceBtn = listContainer
      .find( 'FileRemoveReplaceButtonGroup' ).first();

    // open the modal
    act( () => {
      replaceBtn.prop( 'onRemove' )();
    } );
    wrapper.update();
    const confirm = () => wrapper.find( 'Confirm' );

    expect( confirm().prop( 'open' ) ).toEqual( true );

    // close the modal
    act( () => {
      confirm().prop( 'onCancel' )();
    } );
    wrapper.update();

    expect( confirm().prop( 'open' ) ).toEqual( false );
  } );

  it( 'renders the correct file list items', () => {
    const list = listContainer.find( '.support-files-list' );
    const listItems = list.find( '.support-file-item' );

    expect( listItems.length ).toEqual( props.files.length );
    listItems.forEach( ( item, i ) => {
      const file = props.files[i];
      const filename = item.find( 'span.filename' );
      const removeBtn = item.find( 'FileRemoveReplaceButtonGroup' );

      expect( item.hasClass( 'available' ) ).toEqual( true );
      expect( filename.text() ).toEqual( file.filename );
      expect( removeBtn.exists() ).toEqual( true );
    } );
  } );
} );

describe( '<GraphicSupportFiles />, for additional files', () => {
  let Component;
  let wrapper;
  let listContainer;

  const newProps = {
    ...props,
    headline: 'additional files',
    files: [
      {
        id: 'ck9ld2skk2cjn0720d5s33uxo',
        createdAt: '2020-04-29T13:14:37.942Z',
        updatedAt: '2020-05-06T12:03:29.748Z',
        filename: 'OpenSans-regular.ttf',
        filetype: 'font/ttf',
        filesize: null,
        url: null,
        language: {
          id: 'ck2lzfx710hkq07206thus6pt',
          locale: 'en-us',
          languageCode: 'en',
          displayName: 'English',
          textDirection: 'LTR',
          nativeName: 'English',
          __typename: 'Language',
        },
        use: null,
        __typename: 'SupportFile',
      },
      {
        id: 'ck9jtwa1v293h0720rbd1vdjr',
        createdAt: '2020-04-28T11:29:55.168Z',
        updatedAt: '2020-05-06T12:04:01.749Z',
        filename: 's-secure-rights_transcript.docx',
        filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        filesize: 9000,
        url: null,
        language: {
          id: 'ck2lzfx710hkq07206thus6pt',
          locale: 'en-us',
          languageCode: 'en',
          displayName: 'English',
          textDirection: 'LTR',
          nativeName: 'English',
          __typename: 'Language',
        },
        use: null,
        __typename: 'SupportFile',
      },
    ],
  };

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicSupportFiles { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    listContainer = wrapper.find( 'GraphicSupportFiles' );
  } );

  it( 'renders without crashing', () => {
    expect( listContainer.exists() ).toEqual( true );
  } );

  it( 'renders with the correct className values', () => {
    const containingDiv = listContainer.find( '.graphic-project-support-files' );

    expect( containingDiv.exists() ).toEqual( true );
    expect( containingDiv.hasClass( newProps.headline.replace( ' ', '-' ) ) )
      .toEqual( true );
  } );

  it( 'renders with the list-heading & title', () => {
    const listHeading = listContainer.find( '.list-heading' );
    const title = listContainer.find( '.list-heading > .title' );

    expect( listHeading.exists() ).toEqual( true );
    expect( title.exists() ).toEqual( true );
    expect( title.name() ).toEqual( 'h3' );
    expect( title.text() ).toEqual( newProps.headline );
  } );

  it( 'does not render the LanguageDropdown', () => {
    const langDropdowns = listContainer.find( 'LanguageDropdown' );

    expect( langDropdowns.exists() ).toEqual( false );
  } );

  it( 'renders the IconPopup', () => {
    const iconPopup = listContainer.find( '.list-heading > IconPopup' );

    expect( iconPopup.exists() ).toEqual( true );
    expect( iconPopup.props() ).toEqual( {
      message: newProps.helperText,
      iconSize: 'small',
      iconType: 'info circle',
      popupSize: 'mini',
    } );
  } );

  it( 'renders the Confirm modal', () => {
    const confirm = listContainer.find( 'Confirm' );
    const content = mount( confirm.prop( 'content' ) );

    expect( confirm.exists() ).toEqual( true );
    expect( confirm.hasClass( 'delete' ) ).toEqual( true );
    expect( confirm.prop( 'open' ) ).toEqual( false );
    expect( content.prop( 'className' ) ).toEqual( 'delete_confirm' );
    expect( content.prop( 'headline' ) )
      .toEqual( 'Are you sure you want to delete this file?' );
  } );

  it( 'clicking the remove icon opens the Confirm modal', () => {
    const replaceBtn = listContainer
      .find( 'FileRemoveReplaceButtonGroup' ).first();

    // open the modal
    act( () => {
      replaceBtn.prop( 'onRemove' )();
    } );
    wrapper.update();
    const confirm = wrapper.find( 'Confirm' );

    expect( confirm.prop( 'open' ) ).toEqual( true );
  } );

  it( 'clicking the Confirm modal "No, take me back" button closes the modal', () => {
    const replaceBtn = listContainer
      .find( 'FileRemoveReplaceButtonGroup' ).first();

    // open the modal
    act( () => {
      replaceBtn.prop( 'onRemove' )();
    } );
    wrapper.update();
    const confirm = () => wrapper.find( 'Confirm' );

    expect( confirm().prop( 'open' ) ).toEqual( true );

    // close the modal
    act( () => {
      confirm().prop( 'onCancel' )();
    } );
    wrapper.update();

    expect( confirm().prop( 'open' ) ).toEqual( false );
  } );

  it( 'renders the correct file list items', () => {
    const list = listContainer.find( '.support-files-list' );
    const listItems = list.find( '.support-file-item' );

    expect( listItems.length ).toEqual( newProps.files.length );
    listItems.forEach( ( item, i ) => {
      const file = newProps.files[i];
      const filename = item.find( 'span.filename' );
      const removeBtn = item.find( 'FileRemoveReplaceButtonGroup' );

      expect( item.hasClass( 'available' ) ).toEqual( true );
      expect( filename.text() ).toEqual( file.filename );
      expect( removeBtn.exists() ).toEqual( true );
    } );
  } );
} );

describe( '<GraphicSupportFiles />, when no files are received', () => {
  let Component;
  let wrapper;
  let listContainer;

  const newProps = {
    ...props,
    files: [],
  };

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicSupportFiles { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    listContainer = wrapper.find( 'GraphicSupportFiles' );
  } );

  it( 'renders a No Files message', () => {
    const list = listContainer.find( '.support-files-list' );
    const noFilesWrapper = listContainer.find( '.no-files' );
    const msg = 'No files to upload';

    expect( list.exists() ).toEqual( false );
    expect( noFilesWrapper.exists() ).toEqual( true );
    expect( noFilesWrapper.name() ).toEqual( 'p' );
    expect( noFilesWrapper.contains( msg ) ).toEqual( true );
  } );
} );

describe( '<GraphicSupportFiles />, when a projectId does not exist & local files have been selected for uploading', () => {
  let Component;
  let wrapper;
  let listContainer;

  const newProps = {
    ...props,
    projectId: undefined,
    files: [
      {
        id: 'c9f7158c-a222-47a6-bb74-5e3d3a21d532',
        name: 'askja-asdfjk-qeowiz-zxwe82-mzurjq-duzmwuq-acwac_TW.psd',
        loaded: 0,
        input: {
          dataUrl: 'the-data-url',
          name: 'askja-asdfjk-qeowiz-zxwe82-mzurjq-duzmwuq-acwac_TW.psd',
          size: 509000,
          __typename: 'LocalInputFile',
        },
        language: 'ck2lzfx710hkq07206thus6pt',
        style: '',
        social: [],
        __typename: 'LocalImageFile',
      },
      {
        id: 'f88fe3a6-f328-46b4-b902-fcdf1f483097',
        name: 'test-file-FB.psd',
        loaded: 0,
        input: {
          dataUrl: 'the-data-url',
          name: 'test-file-FB.psd',
          size: 297343,
          __typename: 'LocalInputFile',
        },
        language: 'ck2lzfx710hkq07206thus6pt',
        style: '',
        social: [],
        __typename: 'LocalImageFile',
      },
      // {
      //   id: 'd2dcba4b-9d72-4533-b8fe-e90469ccf870',
      //   name: 'OpenSans-regular.ttf',
      //   loaded: 0,
      //   input: {
      //     dataUrl: 'the-data-url',
      //     name: 'OpenSans-regular.ttf',
      //     size: 217360,
      //     __typename: 'LocalInputFile',
      //   },
      //   language: 'ck2lzfx710hkq07206thus6pt',
      //   style: '',
      //   social: [],
      //   __typename: 'LocalImageFile',
      // },
      // {
      //   id: '47b1c17d-41c2-4f5e-a2a8-914f8e31c106',
      //   name: 'transcript.docx',
      //   loaded: 0,
      //   input: {
      //     dataUrl: 'the-data-url',
      //     name: 'transcript.docx',
      //     size: 9000,
      //     __typename: 'LocalInputFile',
      //   },
      //   language: 'ck2lzfx710hkq07206thus6pt',
      //   style: '',
      //   social: [],
      //   __typename: 'LocalImageFile',
      // },
    ],
  };

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicSupportFiles { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    listContainer = wrapper.find( 'GraphicSupportFiles' );
  } );

  it( 'renders the correct list className value', () => {
    const listItems = listContainer.find( '.support-file-item' );

    listItems.forEach( item => {
      expect( item.hasClass( 'unavailable' ) ).toEqual( true );
    } );
  } );

  it( 'renders the filename', () => {
    const filenames = listContainer.find( '.filename' );

    filenames.forEach( ( filename, i ) => {
      const inputName = newProps.files[i].input.name;

      expect( filename.contains( inputName ) ).toEqual( true );
    } );
  } );
} );

describe( '<GraphicSupportFiles />, when there is a long file name', () => {
  let Component;
  let wrapper;
  let listContainer;

  const newProps = {
    ...props,
    files: [
      {
        ...props.files[0],
        filename: 's-secure-rights_aieaue_kaienwiz_ke8akcua_aeicaie_eiamwyz_shell.png',
      },
    ],
  };

  const { filename } = newProps.files[0];

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
        <GraphicSupportFiles { ...newProps } />
      </MockedProvider>
    );

    wrapper = mount( Component );
    listContainer = wrapper.find( 'GraphicSupportFiles' );
  } );

  it( 'renders a truncated filename with the full filename visually hidden', () => {
    const listItem = listContainer.find( '.support-file-item' );
    const btn = listItem.find( '.truncated' );
    const visuallyHidden = listItem.find( '.hide-visually' );

    expect( btn.prop( 'tooltip' ) ).toEqual( filename );
    expect( btn.text() ).toEqual( 's-secure-rights_aieaue_k...yz_shell.png' );
    expect( visuallyHidden.text() ).toEqual( filename );
  } );
} );
