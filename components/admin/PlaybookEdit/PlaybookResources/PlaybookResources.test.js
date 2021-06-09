import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';

import PlaybookResources from './PlaybookResources';

jest.mock( 'lib/hooks/useFileUpload', () => ( {
  useFileUpload: () => ( {
    uploadFile: () => {},
  } ),
} ) );

const mockProps = {
  assetPath: 'playbook/2021/06/commons.america.gov_ckpimh5330nep0961100ouir2',
  files: [
    {
      __typename: 'SupportFile',
      createdAt: '2021-06-04T23:26:31.479Z',
      editable: false,
      filename: 'mostly-adequate-guide.pdf',
      filesize: 2495004,
      filetype: 'application/pdf',
      id: 'ckpiyia7v0ru60961xa31vqej',
      language: {
        __typename: 'Language',
        displayName: 'English',
        id: 'ck80ddxoc0072088860vuwhiu',
        languageCode: 'en',
        locale: 'en-us',
        nativeName: 'English',
        textDirection: 'LTR',
      },
      signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/playbook/2021/06/dawnjfnjfnjfekwnjfn',
      updatedAt: '2021-06-04T23:26:31.479Z',
      url: 'playbook/2021/06/commons.america.gov_ckpimh5330nep0961100ouir2/mostly-adequate-guide.pdf',
    },
    {
      __typename: 'SupportFile',
      createdAt: '2021-06-04T23:26:31.479Z',
      editable: false,
      filename: 'better-user-stories-webinar-workbook.docx',
      filesize: 2495004,
      filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      id: 'ckpiylluo0rxi0961ubefs9jv',
      language: {
        __typename: 'Language',
        displayName: 'English',
        id: 'ck80ddxoc0072088860vuwhiu',
        languageCode: 'en',
        locale: 'en-us',
        nativeName: 'English',
        textDirection: 'LTR',
      },
      signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/playbook/2021/06/fqwnfwqnfwufwbquifhwji',
      updatedAt: '2021-06-04T23:26:31.479Z',
      url: 'playbook/2021/06/commons.america.gov_ckpiylluo0rxi0961ubefs9jv/better-user-stories-webinar-workbook.docx',
    },
  ],
  projectId: 'ckpimh5330nep0961100ouir2',
  updateMutation: () => {},
};

describe( '<PlaybookResources />', () => {
  const Component = (
    <MockedProvider addTypename>
      <PlaybookResources { ...mockProps } />
    </MockedProvider>
  );

  const wrapper = mount( Component );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'properly displays the number of uploaded files', () => {
    const subheader = wrapper.find( 'strong' );

    expect( subheader.exists() ).toEqual( true );
    expect( subheader.text() ).toEqual( `Files Uploaded (${mockProps.files.length})` );
  } );

  it( 'lists all the currently uploaded files', () => {
    const fileList = wrapper.find( 'FileList' );
    const files = fileList.find( 'li' );

    expect( fileList.exists() ).toEqual( true );
    expect( files.length ).toEqual( mockProps.files.length );
    files.forEach( ( item, i ) => {
      expect( item.text() ).toEqual( mockProps.files[i].filename );
      expect( item.find( 'FileRemoveReplaceButtonGroup' ).exists() ).toEqual( true );
    } );
  } );

  it( 'has an add files button', () => {
    const addFiles = wrapper.find( 'ButtonAddFiles' );
    const addFilesBtn = addFiles.find( 'button' );

    expect( addFilesBtn.exists() ).toEqual( true );
    expect( addFilesBtn.text() ).toEqual( '+ Add Files' );
  } );

  it( 'is set to accept multiple PDFs and Word docs', () => {
    const fileUploader = wrapper.find( 'input' );

    const accepted = fileUploader.prop( 'accept' );

    expect( fileUploader.exists() ).toEqual( true );
    expect( fileUploader.prop( 'type' ) ).toEqual( 'file' );
    expect( fileUploader.prop( 'multiple' ) ).toEqual( true );
    expect( accepted.includes( '.docx' ) ).toEqual( true );
    expect( accepted.includes( '.pdf' ) ).toEqual( true );
  } );
} );

describe( '<PlaybookResources />, with no files', () => {
  const emptyMocks = {
    ...mockProps,
    files: [],
  };

  const Component = (
    <MockedProvider addTypename>
      <PlaybookResources { ...emptyMocks } />
    </MockedProvider>
  );

  const wrapper = mount( Component );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not have an uploaded files subheader', () => {
    const subheader = wrapper.find( 'strong' );

    expect( subheader.exists() ).toEqual( false );
  } );

  it( 'does not have a files list', () => {
    const fileList = wrapper.find( 'FileList' );

    expect( fileList.exists() ).toEqual( false );
  } );
} );
