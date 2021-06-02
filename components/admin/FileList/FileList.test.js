import { mount } from 'enzyme';

import FileList from './FileList';

import { truncateAndReplaceStr } from 'lib/utils';

jest.mock(
  'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup',
  () => function FileRemoveReplaceButtonGroup() { return ''; },
);

const mockFiles = [
  {
    id: 'ck9jtuqhy292w07200tfpbkju',
    createdAt: '2020-04-28T11:28:43.173Z',
    updatedAt: '2020-05-06T12:04:17.325Z',
    filename: 'secure-rights.pdf',
    filetype: '.pdf',
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
    filename: 'secure-rights.docx',
    filetype: '.docx',
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
    id: 'ck9jtsbvz291icqwewqfrdcc',
    createdAt: '2020-04-28T11:26:50.874Z',
    updatedAt: '2020-05-06T12:04:52.123Z',
    filename: 'secure-rights.png',
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
];

describe( '<FileList>', () => {
  const wrapper = mount( <FileList files={ mockFiles } onRemove={ () => {} } projectId="1234" /> );

  const list = wrapper.find( 'FileList' );

  it( 'renders without crashing', () => {
    expect( list.exists() ).toEqual( true );
  } );

  it( 'renders the correct file list items', () => {
    const listItems = list.find( 'li' );

    expect( listItems.length ).toEqual( mockFiles.length );

    listItems.forEach( ( item, i ) => {
      const file = mockFiles[i];

      const filename = item.find( 'Filename' );
      const filenameSpan = filename.find( 'span' );

      const removeBtn = item.find( 'FileRemoveReplaceButtonGroup' );

      expect( item.hasClass( 'available' ) ).toEqual( true );
      expect( filename.exists() ).toEqual( true );
      expect( filenameSpan.text() ).toEqual( file.filename );
      expect( removeBtn.exists() ).toEqual( true );
    } );
  } );
} );

describe( '<FileList />, when there is a long file name', () => {
  const newFiles = [
    {
      ...mockFiles[0],
      filename: 's-secure-rights_aieaue_kaienwiz_ke8akcua_aeicaie_eiamwyz_shell.png',
    },
  ];

  const wrapper = mount( <FileList files={ newFiles } onRemove={ () => {} } projectId="1234" /> );

  const { filename } = newFiles[0];

  it( 'renders a truncated filename with the full filename visually hidden', () => {
    const listItem = wrapper.find( 'Filename' );
    const focusable = listItem.find( '[tooltip]' );
    const visuallyHidden = listItem.find( '.hide-visually' );
    const shortName = truncateAndReplaceStr( filename, 20, 28 );

    expect( focusable.prop( 'tooltip' ) ).toEqual( filename );
    expect( focusable.text() ).toEqual( shortName );
    expect( visuallyHidden.text() ).toEqual( filename );
  } );
} );

describe( '<FileList />, when a projectId does not exist & local files have been selected for uploading', () => {
  const newFiles = [
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
  ];

  const wrapper = mount( <FileList files={ newFiles } onRemove={ () => {} } /> );

  it( 'renders the correct list className value', () => {
    const listItems = wrapper.find( 'li' );

    listItems.forEach( item => {
      expect( item.hasClass( 'unavailable' ) ).toEqual( true );
    } );
  } );

  it( 'renders the filename', () => {
    const filenames = wrapper.find( 'Filename > span' );

    filenames.forEach( ( filename, i ) => {
      const inputName = newFiles[i].input.name;

      expect( filename.contains( inputName ) ).toEqual( true );
    } );
  } );
} );
