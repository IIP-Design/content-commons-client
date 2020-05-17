import { mount } from 'enzyme';

import SignedUrlLink from './SignedUrlLink';

const mockSignedUrl = 'https://example.jpg';

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: mockSignedUrl } ) ) );

const props = {
  file: {
    bureaus: [],
    content: {
      rawText: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
      html: '<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English</p>',
    },
    excerpt: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
    filename: 'mocked-file.docx',
    filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    id: 'efnjnfekjnu',
    language: { language_code: 'en', locale: 'en-us', text_direction: 'ltr', display_name: 'English', native_name: 'English' },
    modified: '2020-05-15T15:25:43.029Z',
    owner: 'GPA Press Office',
    published: '2020-05-15T15:25:43.029Z',
    site: 'commons.america.gov',
    tags: [],
    title: 'Mocked_File',
    type: 'document',
    url: 'https://s3.amazonaws.com/daily_guidance/2020/05/sample/mocked-file.docx',
    use: 'Background Briefing',
    visibility: 'INTERNAL',
  },
  isPreview: false,
};

describe( '<SignedUrlLink />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <SignedUrlLink { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the download link with signed url and filename', () => {
    const wrapper = mount( <SignedUrlLink { ...props } /> );
    const item = wrapper.find( 'Item' );

    expect( item.prop( 'as' ) ).toEqual( 'a' );
    expect( item.prop( 'href' ) ).toEqual( mockSignedUrl );
    expect( item.prop( 'download' ) ).toEqual( props.file.filename );
  } );

  it( 'renders preview version without links', () => {
    const newProps = { ...props, isPreview: true };
    const wrapper = mount( <SignedUrlLink { ...newProps } /> );

    const previewText = wrapper.find( '.preview-text' );

    expect( previewText.exists() ).toEqual( true );

    const item = wrapper.find( 'Item' );

    expect( item.prop( 'as' ) ).toEqual( 'span' );
    expect( item.prop( 'href' ) ).toEqual( null );
    expect( item.prop( 'download' ) ).toEqual( null );
  } );
} );
