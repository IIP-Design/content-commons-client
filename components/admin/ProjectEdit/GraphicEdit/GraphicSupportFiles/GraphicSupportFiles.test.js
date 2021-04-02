import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/client/testing';
import { act } from 'react-dom/test-utils';
import { UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import GraphicSupportFiles from './GraphicSupportFiles';
import { truncateAndReplaceStr } from 'lib/utils';

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

const image1 = {
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
};

const image2 = {
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
};

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
    image1,
    image2,
  ],
  updateNotification: jest.fn(),
};

const projectData = {
  id: props.projectId,
  createdAt: '2020-04-22T11:40:51.599Z',
  updatedAt: '2020-05-04T17:17:30.316Z',
  publishedAt: null,
  type: 'SOCIAL_MEDIA',
  title: 'Just another graphic project',
  copyright: 'NO_COPYRIGHT',
  alt: 'some alt text',
  descPublic: 'the public description',
  descInternal: 'the internal description',
  assetPath: null,
  author: {
    id: 'ck2m042xo0rnp0720nb4gxjix',
    firstName: 'Edwin',
    lastName: 'Mah',
    email: 'mahe@america.gov',
    __typename: 'User',
  },
  team: {
    id: 'ck2qgfbku0ubh0720iwhkvuyn',
    name: 'GPA Press Office',
    contentTypes: ['GRAPHIC'],
    __typename: 'Team',
  },
  status: 'DRAFT',
  visibility: 'PUBLIC',
  images: [image1, image2],
  supportFiles: [props.files[1], props.files[2]],
  categories: [
    {
      id: 'ck2lzgu1c0re307202dlrnue2',
      translations: [
        {
          id: 'ck2lzfxab0hls0720o2sjmoqw',
          name: 'about america',
          language: {
            id: 'ck2lzfx710hkq07206thus6pt',
            locale: 'en-us',
            languageCode: 'en',
            displayName: 'English',
            textDirection: 'LTR',
            nativeName: 'English',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
        {
          id: 'ck2lzfxbe0hlz0720qou6kr5x',
          name: 'conozca Estados Unidos',
          language: {
            id: 'ck2lzfx7o0hl707205uteku77',
            locale: 'es-es',
            languageCode: 'es',
            displayName: 'Spanish',
            textDirection: 'LTR',
            nativeName: 'Español',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
        {
          id: 'ck2lzfxc90hm60720onv6tbro',
          name: 'Amérique',
          language: {
            id: 'ck2lzfx710hkp07206oo0icbv',
            locale: 'fr-fr',
            languageCode: 'fr',
            displayName: 'French',
            textDirection: 'LTR',
            nativeName: 'Français',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
      ],
      __typename: 'Category',
    },
    {
      id: 'ck2lzgu1e0re90720th24sglh',
      translations: [
        {
          id: 'ck2lzfye00hxg0720djwj20fs',
          name: 'geography',
          language: {
            id: 'ck2lzfx710hkq07206thus6pt',
            locale: 'en-us',
            languageCode: 'en',
            displayName: 'English',
            textDirection: 'LTR',
            nativeName: 'English',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
        {
          id: 'ck2lzfyej0hxn0720fwm4ior3',
          name: 'Geografía',
          language: {
            id: 'ck2lzfx7o0hl707205uteku77',
            locale: 'es-es',
            languageCode: 'es',
            displayName: 'Spanish',
            textDirection: 'LTR',
            nativeName: 'Español',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
        {
          id: 'ck2lzfyf10hxu072065vqpr38',
          name: 'Géographie',
          language: {
            id: 'ck2lzfx710hkp07206oo0icbv',
            locale: 'fr-fr',
            languageCode: 'fr',
            displayName: 'French',
            textDirection: 'LTR',
            nativeName: 'Français',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
      ],
      __typename: 'Category',
    },
  ],
  tags: [
    {
      id: 'ck2lzgu5e0rhu07207x85lxmb',
      translations: [
        {
          id: 'ck2lzgiwy0nx40720sedxm612',
          name: 'biomedical science',
          language: {
            id: 'ck2lzfx710hkq07206thus6pt',
            locale: 'en-us',
            languageCode: 'en',
            displayName: 'English',
            textDirection: 'LTR',
            nativeName: 'English',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
        {
          id: 'ck2lzgixn0nxb072018rszcc5',
          name: 'ciencia Biomedica',
          language: {
            id: 'ck2lzfx7o0hl707205uteku77',
            locale: 'es-es',
            languageCode: 'es',
            displayName: 'Spanish',
            textDirection: 'LTR',
            nativeName: 'Español',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
        {
          id: 'ck2lzgiy90nxi0720u91l9paa',
          name: 'science biomédicale',
          language: {
            id: 'ck2lzfx710hkp07206oo0icbv',
            locale: 'fr-fr',
            languageCode: 'fr',
            displayName: 'French',
            textDirection: 'LTR',
            nativeName: 'Français',
            __typename: 'Language',
          },
          __typename: 'LanguageTranslation',
        },
      ],
      __typename: 'Tag',
    },
  ],
  __typename: 'GraphicProject',
};

describe( '<GraphicSupportFiles />, for editable files', () => {
  const mocks = [
    {
      request: {
        query: UPDATE_GRAPHIC_PROJECT_MUTATION,
        variables: {
          data: {
            type: 'SOCIAL_MEDIA',
            supportFiles: {
              'delete': {
                id: props.files[0].id,
              },
            },
          },
          where: {
            id: props.projectId,
          },
        },
      },
      result: {
        data: {
          updateGraphicProject: projectData,
        },
      },
    },
  ];

  let Component;
  let wrapper;
  let listContainer;

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ mocks } addTypename={ false }>
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

  it( 'clicking the Confirm modal "Yes, delete forever" button results in a successful deletion', () => {
    const replaceBtn = listContainer
      .find( 'FileRemoveReplaceButtonGroup' ).first();

    // open the modal
    act( () => {
      replaceBtn.prop( 'onRemove' )();
    } );
    wrapper.update();
    const confirm = () => wrapper.find( 'Confirm' );

    expect( confirm().prop( 'open' ) ).toEqual( true );

    // confirm deletion
    const deleteConfirmTest = async done => {
      act( () => {
        confirm().prop( 'onConfirm' )();
      } );
      await wait( 4 ); // wait for mutation to resolve
      wrapper.update();

      // handleReset is called upon successful deletion
      expect( confirm().prop( 'open' ) ).toEqual( false );
      done();
    };

    deleteConfirmTest();
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

  const mocks = [
    {
      request: {
        query: UPDATE_GRAPHIC_PROJECT_MUTATION,
        variables: {
          data: {
            type: 'SOCIAL_MEDIA',
            supportFiles: {
              'delete': {
                id: newProps.files[0].id,
              },
            },
          },
          where: {
            id: newProps.projectId,
          },
        },
      },
      result: {
        data: {
          updateGraphicProject: projectData,
        },
      },
    },
  ];

  beforeEach( () => {
    Component = (
      <MockedProvider mocks={ mocks } addTypename>
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

  it( 'clicking the Confirm modal "Yes, delete forever" button results in a successful deletion', () => {
    const replaceBtn = listContainer
      .find( 'FileRemoveReplaceButtonGroup' ).first();

    // open the modal
    act( () => {
      replaceBtn.prop( 'onRemove' )();
    } );
    wrapper.update();
    const confirm = () => wrapper.find( 'Confirm' );

    expect( confirm().prop( 'open' ) ).toEqual( true );

    // confirm deletion
    const deleteConfirmTest = async done => {
      act( () => {
        confirm().prop( 'onConfirm' )();
      } );
      await wait( 4 ); // wait for mutation to resolve
      wrapper.update();

      // handleReset is called upon successful deletion
      expect( confirm().prop( 'open' ) ).toEqual( false );
      done();
    };

    deleteConfirmTest();
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
        id: 'd2dcba4b-9d72-4533-b8fe-e90469ccf870',
        name: 'OpenSans-regular.ttf',
        loaded: 0,
        input: {
          dataUrl: 'the-data-url',
          name: 'OpenSans-regular.ttf',
          size: 217360,
          __typename: 'LocalInputFile',
        },
        language: 'ck2lzfx710hkq07206thus6pt',
        style: '',
        social: [],
        __typename: 'LocalImageFile',
      },
      {
        id: '47b1c17d-41c2-4f5e-a2a8-914f8e31c106',
        name: 'transcript.docx',
        loaded: 0,
        input: {
          dataUrl: 'the-data-url',
          name: 'transcript.docx',
          size: 9000,
          __typename: 'LocalInputFile',
        },
        language: 'ck2lzfx710hkq07206thus6pt',
        style: '',
        social: [],
        __typename: 'LocalImageFile',
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

  it( 'renders the correct list className value', () => {
    const listItems = listContainer.find( '.support-file-item' );

    listItems.forEach( item => {
      expect( item.hasClass( 'unavailable' ) ).toEqual( true );
    } );
  } );

  it( 'renders the filename', () => {
    const filenames = listContainer.find( 'Filename > .filename' );

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
    const focusable = listItem.find( '[tooltip]' );
    const visuallyHidden = listItem.find( '.hide-visually' );
    const shortName = truncateAndReplaceStr( filename, 20, 28 );

    expect( focusable.prop( 'tooltip' ) ).toEqual( filename );
    expect( focusable.text() ).toEqual( shortName );
    expect( visuallyHidden.text() ).toEqual( filename );
  } );
} );
