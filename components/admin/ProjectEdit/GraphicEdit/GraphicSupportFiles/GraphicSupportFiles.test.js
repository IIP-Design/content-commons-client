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

jest.mock(
  'components/admin/dropdowns/LanguageDropdown/LanguageDropdown',
  () => function LanguageDropdown() { return ''; },
);

const props = {
  projectId: 'project-123',
  headline: 'editable files',
  helperText: 'Original files that may be edited and adapted as needed for reuse.',
  files: [
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
  ],
  updateNotification: jest.fn(),
};

const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';

  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};

describe( '<GraphicSupportFiles />, for editable files', () => {
  let Component;
  let wrapper;
  let listContainer;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ [] } addTypename>
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
      const actions = item.find( 'span.actions' );
      const language = item.find( 'span.actions > LanguageDropdown' );
      const removeBtn = item.find( 'span.actions > FileRemoveReplaceButtonGroup' );

      expect( item.hasClass( 'available' ) ).toEqual( true );
      expect( filename.text() ).toEqual( file.filename );
      expect( actions.exists() ).toEqual( true );
      expect( language.exists() ).toEqual( true );
      expect( language.prop( 'id' ) ).toEqual( file.id );
      expect( language.prop( 'value' ) ).toEqual( file.language.id );
      expect( typeof language.prop( 'onChange' ) ).toEqual( 'function' );
      expect( language.prop( 'onChange' ).name )
        .toEqual( 'handleLanguageChange' );
      expect( language.prop( 'disabled' ) ).toEqual( false );
      expect( language.prop( 'required' ) ).toEqual( true );
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
      const actions = item.find( 'span.actions' );
      const language = item.find( 'span.actions > LanguageDropdown' );
      const removeBtn = item.find( 'span.actions > FileRemoveReplaceButtonGroup' );

      expect( item.hasClass( 'available' ) ).toEqual( true );
      expect( filename.text() ).toEqual( file.filename );
      expect( actions.exists() ).toEqual( true );
      expect( language.exists() ).toEqual( false );
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
