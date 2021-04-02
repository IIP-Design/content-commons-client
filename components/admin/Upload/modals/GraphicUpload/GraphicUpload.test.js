import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { useFileStateManager } from 'lib/hooks/useFileStateManager';
import { suppressActWarning } from 'lib/utils';

import GraphicUpload from './GraphicUpload';

jest.mock(
  'components/admin/EditFileGrid/EditFileGrid',
  () => function EditFileGrid() { return ''; },
);
jest.mock(
  'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown',
  () => function GraphicStyleDropdown() { return ''; },
);
jest.mock(
  'components/admin/Upload/modals/IncludeRequiredFileMsg/IncludeRequiredFileMsg',
  () => function IncludeRequiredFileMsg() { return ''; },
);
jest.mock(
  'components/admin/dropdowns/LanguageDropdown/LanguageDropdown',
  () => function LanguageDropdown() { return ''; },
);
jest.mock(
  'components/admin/dropdowns/SocialPlatformDropdown/SocialPlatformDropdown',
  () => function SocialPlatformDropdown() { return ''; },
);

jest.mock( 'lib/hooks/useFileStateManager' );

jest.mock(
  '@apollo/client',
  () => ( {
    useApolloClient: jest.fn( () => ( {
      writeData: jest.fn(),
    } ) ),
  } ),
);

jest.mock( 'next/router', () => ( { useRouter: jest.fn() } ) );

const files = [
  {
    id: '3db9cba0-4e7d-4a6f-aecf-asdfikq8aa',
    name: '4_3_Serious_FB.jpg',
    size: 433851,
    language: 'ck2lzfx710hkq07206thus6pt',
    style: '',
    social: ['ck9h3m3g626bd07201gh712vk'],
    input: {
      type: 'image/jpeg',
    },
    loaded: 0,
  },
  {
    id: '3db9cba0-4e7d-4a6f-aecf-e8a3e76b3d13',
    name: '4_3_Serious_TW.jpg',
    size: 297343,
    language: 'ck2lzfx710hkq07206thus6pt',
    style: '',
    social: ['ck9h3m3g626bd07201gh712vk'],
    input: {
      type: 'image/jpeg',
    },
    loaded: 0,
  },
  {
    id: '3db9cba0-4e7d-4a6f-aecf-aszia',
    name: 'transcript.docx',
    size: 51893,
    language: 'ck2lzfx710hkq07206thus6pt',
    style: '',
    social: [],
    input: {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    loaded: 0,
  },
  {
    id: '52d247e6-ad4a-4f73-a330-372e33ed585b',
    name: 'test-file-shell.png',
    size: 18986,
    language: 'ck2lzfx710hkq07206thus6pt',
    style: 'ck9h3koe426aa0720y421wmk3',
    styleSelection: 'Clean',
    social: [],
    input: {
      type: 'image/png',
    },
    loaded: 0,
  },
  {
    id: '1731fbb4-d785-40d8-a0b5-ad0a542d9d88',
    name: 'OpenSans-Regular.ttf',
    size: 217360,
    language: 'ck2lzfx710hkq07206thus6pt',
    style: '',
    social: [],
    input: {
      type: '',
    },
    loaded: 0,
  },
  {
    id: '2ccc920d-f179-4952-8973-de0770297419',
    name: '4_3_Serious_English-(Simplified)_TW.psd',
    size: 402222,
    language: '',
    style: '',
    social: [],
    input: {
      type: 'image/vnd.adobe.photoshop',
    },
    loaded: 0,
  },
];

describe( '<GraphicUpload />, if graphic files have been selected for upload', () => {
  const props = {
    closeModal: jest.fn(),
    files: [
      {
        lastModified: 1589375838787,
        lastModifiedDate: {},
        name: '4_3_Serious_FB.jpg',
        size: 433851,
        type: 'image/jpeg',
        webkitRelativePath: '',
      },
      {
        lastModified: 1589375841841,
        lastModifiedDate: {},
        name: '4_3_Serious_TW.jpg',
        size: 297343,
        type: 'image/jpeg',
        webkitRelativePath: '',
      },
      {
        lastModified: 1589821475267,
        lastModifiedDate: {},
        name: 'transcript.docx',
        size: 51893,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        webkitRelativePath: '',
      },
      {
        lastModified: 1589821815569,
        lastModifiedDate: {},
        name: 'test-file-shell.png',
        size: 18986,
        type: 'image/png',
        webkitRelativePath: '',
      },
      {
        lastModified: 1589821518000,
        lastModifiedDate: {},
        name: 'OpenSans-Regular.ttf',
        size: 217360,
        type: '',
        webkitRelativePath: '',
      },
      {
        lastModified: 158187323758173,
        lastModifiedDate: {},
        name: '4_3_Serious_English-(Simplified)_TW.psd',
        size: 402222,
        type: 'image/vnd.adobe.photoshop',
        webkitRelativePath: '',
      },
    ],
  };

  let Component;
  let wrapper;

  useFileStateManager.mockImplementation( () => ( {
    state: { files },
    dispatch: jest.fn(),
  } ) );

  beforeEach( () => {
    Component = <GraphicUpload { ...props } />;
    wrapper = mount( Component );
    // jest.resetModules();
    // useFileStateManager.mockImplementation( () => ( {
    //   state: { files },
    //   dispatch: jest.fn(),
    // } ) );
  } );

  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the container', () => {
    const container = wrapper.find( '.container' );

    expect( container.exists() ).toEqual( true );
  } );

  it( 'renders the heading', () => {
    const heading = wrapper.find( 'h1' );

    expect( heading.text() ).toEqual( 'SOCIAL MEDIA GRAPHIC PROJECT' );
  } );

  it( 'renders the uploading file count message', () => {
    const filesMsg = wrapper.find( '.files' );

    expect( filesMsg.text() ).toEqual( 'Preparing 6 files for upload...' );
  } );

  it( 'renders the EditFileGrid', () => {
    const editFileGrid = wrapper.find( 'EditFileGrid' );

    expect( toJSON( editFileGrid ) ).toMatchSnapshot();
  } );

  it( 'calling create does not display IncludeRequiredFileMsg', async () => {
    const editFileGrid = wrapper.find( 'EditFileGrid' );
    const requiredFileMsg = () => wrapper.find( 'IncludeRequiredFileMsg' );
    const { onContinue } = editFileGrid.props();

    const createFnTest = async () => {
      await onContinue();
      wrapper.update();
    };

    await createFnTest()
      .then( () => {
        const { includeRequiredFileMsg } = requiredFileMsg().props();

        expect( includeRequiredFileMsg ).toEqual( false );
      } );
  } );
} );

describe( '<GraphicUpload />, if no graphic files have been selected for upload', () => {
  const props = {
    closeModal: jest.fn(),
    files: [
      {
        lastModified: 1589821475267,
        lastModifiedDate: {},
        name: 'transcript.docx',
        size: 51893,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        webkitRelativePath: '',
      },
      {
        lastModified: 1589821815569,
        lastModifiedDate: {},
        name: 'test-file-shell.png',
        size: 18986,
        type: 'image/png',
        webkitRelativePath: '',
      },
      {
        lastModified: 1589821518000,
        lastModifiedDate: {},
        name: 'OpenSans-Regular.ttf',
        size: 217360,
        type: '',
        webkitRelativePath: '',
      },
      {
        lastModified: 158187323758173,
        lastModifiedDate: {},
        name: '4_3_Serious_English-(Simplified)_TW.psd',
        size: 402222,
        type: 'image/vnd.adobe.photoshop',
        webkitRelativePath: '',
      },
    ],
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicUpload { ...props } />;
    wrapper = mount( Component );
    // jest.resetModules();
    useFileStateManager.mockImplementation( () => ( {
      state: {
        files: files.filter( file => {
          const { input: { type }, name } = file;
          const isJpgOrPng = type.includes( 'png' ) || type.includes( 'jpeg' );
          const filename = name.toLowerCase();
          const isFacebook = filename.includes( 'fb' ) || filename.includes( 'facebook' );
          const isTwitter = filename.includes( 'tw' ) || filename.includes( 'twitter' );
          const isGraphicFile = ( isFacebook || isTwitter ) && isJpgOrPng;

          return !isGraphicFile;
        } ),
      },
      dispatch: jest.fn(),
    } ) );
  } );

  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the uploading file count message', () => {
    const filesMsg = wrapper.find( '.files' );

    expect( filesMsg.text() ).toEqual( 'Preparing 4 files for upload...' );
  } );

  it( 'calling create displays IncludeRequiredFileMsg', async () => {
    const editFileGrid = wrapper.find( 'EditFileGrid' );
    const requiredFileMsg = () => wrapper.find( 'IncludeRequiredFileMsg' );
    const { onContinue } = editFileGrid.props();

    const createFnTest = async () => {
      await onContinue();
      wrapper.update();
    };

    await createFnTest()
      .then( () => {
        const { includeRequiredFileMsg } = requiredFileMsg().props();

        expect( includeRequiredFileMsg ).toEqual( true );
      } );
  } );
} );
