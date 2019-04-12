import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import EditSupportFilesContent, { SUPPORT_FILES_QUERY } from './EditSupportFilesContent';

const props = {
  projectId: '123',
  fileType: 'other',
  closeEditModal: jest.fn(),
  orderByField: 'filetype_not',
};

const mocks = [
  {
    request: {
      query: SUPPORT_FILES_QUERY( props ),
      variables: {
        id: props.projectId,
        fileType: 'srt',
        orderBy: 'filename_ASC'
      }
    },
    result: {
      data: {
        project: {
          id: '123',
          files: [
            {
              id: 'euosiq',
              filename: 'file-1.jpg',
              filetype: 'jpg',
              use: {
                id: 'th89',
                name: 'Thumbnail/Cover Image'
              },
              language: { id: '8h8sof', displayName: 'English' }
            },
            {
              id: 'aewk81',
              filename: 'file-2.mp3',
              filetype: 'mp3',
              use: {
                id: 'me92',
                name: 'Memes'
              },
              language: { id: '9weijd', displayName: 'French' }
            }
          ]
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <EditSupportFilesContent { ...props } />
  </MockedProvider>
);

describe( '<EditSupportFilesContent />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const editSupportFilesContent = wrapper.find( 'EditSupportFilesContent' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
      />
    );

    expect( editSupportFilesContent.exists() ).toEqual( true );
    expect( editSupportFilesContent.contains( loader ) ).toEqual( true );
    expect( editSupportFilesContent.find( 'p' ).text() )
      .toEqual( 'Loading support file(s)...' );
    expect( toJSON( editSupportFilesContent ) ).toMatchSnapshot();
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: SUPPORT_FILES_QUERY( props ),
          variables: {
            id: props.projectId,
            fileType: 'srt',
            orderBy: 'filename_ASC'
          }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks }>
        <EditSupportFilesContent { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const editSupportFilesContent = wrapper.find( 'EditSupportFilesContent' );
    const div = editSupportFilesContent
      .find( 'div.edit-support-files-content.error' );
    const icon = <Icon color="red" name="exclamation triangle" />;
    const span = <span>Loading error...</span>;

    expect( div.exists() ).toEqual( true );
    expect( editSupportFilesContent.contains( icon ) )
      .toEqual( true );
    expect( editSupportFilesContent.contains( span ) )
      .toEqual( true );
  } );

  it( 'renders `null` if project is `null`', async () => {
    const nullMocks = [
      {
        request: {
          query: SUPPORT_FILES_QUERY( props ),
          variables: {
            id: props.projectId,
            fileType: 'srt',
            orderBy: 'filename_ASC'
          }
        },
        result: {
          data: { project: null }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks }>
        <EditSupportFilesContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const editSupportFilesContent = wrapper.find( 'EditSupportFilesContent' );

    expect( editSupportFilesContent.html() ).toEqual( null );
  } );

  it( '`getFileExtension` returns a file\'s extension', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const editSupportFilesContent = wrapper.find( 'EditSupportFilesContent' );
    const inst = editSupportFilesContent.instance();
    const { files } = inst.props.data.project;

    files.forEach( ( file, i ) => {
      expect( inst.getFileExtension( file.filename ) )
        .toEqual( `.${files[i].filetype}` );
    } );
  } );

  it( '`getFileExtensions` returns an array of unique file extensions', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const editSupportFilesContent = wrapper.find( 'EditSupportFilesContent' );
    const inst = editSupportFilesContent.instance();
    const { files } = inst.props.data.project;
    const extensions = inst.getFileExtensions( files );

    expect( extensions ).toEqual( ['.jpg', '.mp3'] );
  } );

  it( 'clicking the Cancel button calls `closeEditModal`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const editSupportFilesContent = wrapper.find( 'EditSupportFilesContent' );
    const cancelCloseBtn = editSupportFilesContent.find( 'Button.cancel-close' );

    cancelCloseBtn.simulate( 'click' );

    expect( props.closeEditModal ).toHaveBeenCalled();
  } );

  it( 'assigns `addFilesInputRef` to the file `input` element', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const editSupportFilesContent = wrapper.find( 'EditSupportFilesContent' );
    const inst = editSupportFilesContent.instance();
    const input = editSupportFilesContent.find( 'input#upload-file--multiple' );

    expect( input.exists() ).toEqual( true );
    expect( inst.addFilesInputRef ).toBeTruthy();
  } );

  it( 'clicking Add Files button calls `handleAddFiles`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const editSupportFilesContent = wrapper.find( 'EditSupportFilesContent' );
    const addFilesBtn = wrapper.find( 'Button.add-files' );
    const inst = editSupportFilesContent.instance();
    const spy = jest.spyOn( inst, 'handleAddFiles' );

    inst.forceUpdate();
    addFilesBtn.simulate( 'click' );

    expect( spy ).toHaveBeenCalled();
  } );
} );
