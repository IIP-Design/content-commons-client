import { mount } from 'enzyme';
import SupportFiles from './SupportFiles';

jest.mock(
  'components/admin/ProjectEdit/GraphicEdit/GraphicSupportFiles/GraphicSupportFiles',
  () => function GraphicSupportFiles() { return ''; },
);

const props = {
  projectId: 'project-123',
  updateNotification: jest.fn(),
  fileTypes: [
    {
      headline: 'editable files',
      helperText: 'Original files that may be edited and adapted as needed for reuse.',
      files: [
        {
          id: 'ck9jtsbvz291i0720by3crdcc',
          createdAt: '2020-04-28T11:26:50.874Z',
          updatedAt: '2020-04-28T14:33:38.016Z',
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
          updatedAt: '2020-05-01T14:05:55.765Z',
          filename: 's-secure-rights_asikaid_ksidn_kaslkdfiwnz_iqmshqusm_kwspamdisa_sucms_english.psd',
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
    },
    {
      headline: 'additional files',
      helperText: 'Additional files may include transcript files, style guides, or other support files needed by internal staff in order to properly use these graphics.',
      files: [
        {
          id: 'ck9jtwa1v293h0720rbd1vdjr',
          createdAt: '2020-04-28T11:29:55.168Z',
          updatedAt: '2020-04-28T11:29:55.168Z',
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
          updatedAt: '2020-04-29T13:14:37.942Z',
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
    },
  ],
};

describe( '<SupportFiles />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <SupportFiles { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders receives the correct props', () => {
    expect( wrapper.props() ).toEqual( props );
  } );

  it( 'renders receives the GraphicSupportFiles', () => {
    const filesList = wrapper.find( 'GraphicSupportFiles' );

    expect( filesList.exists() ).toEqual( true );
    expect( filesList.length ).toEqual( props.fileTypes.length );
    filesList.forEach( ( file, i ) => {
      const { headline, helperText, files } = props.fileTypes[i];

      expect( file.prop( 'projectId' ) ).toEqual( props.projectId );
      expect( file.prop( 'headline' ) ).toEqual( headline );
      expect( file.prop( 'helperText' ) ).toEqual( helperText );
      expect( file.prop( 'files' ) ).toEqual( files );
    } );
  } );

  it( 'renders receives the separator', () => {
    const separator = wrapper.find( 'div.separator' );

    expect( separator.exists() ).toEqual( true );
    expect( separator.length ).toEqual( props.fileTypes.length - 1 );
  } );
} );
