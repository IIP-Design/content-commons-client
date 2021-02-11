import { mount } from 'enzyme';

import FileListDisplay from './FileListDisplay';
import { fileMocks } from './mocks';

const props = {
  error: null,
  files: fileMocks,
  fileType: 'document',
};

describe( 'FileListDisplay', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <FileListDisplay { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders file list with correct filenames listed', () => {
    const wrapper = mount( <FileListDisplay { ...props } /> );

    const fileList = wrapper.find( 'ul.fileList' );

    expect( fileList.exists() ).toEqual( true );
    fileMocks.forEach( file => expect( fileList.contains( file.filename ) ) );
  } );

  it( 'returns no documents found message if no files are provided', () => {
    const newProps = { ...props, files: [] };
    const noDocsMsg = `There are no ${newProps.fileType}s for this package.`;

    const wrapper = mount( <FileListDisplay { ...newProps } /> );

    expect( wrapper.contains( noDocsMsg ) ).toEqual( true );
  } );

  it( 'renders a loading message if files are undefined', () => {
    const newProps = { ...props, files: undefined };

    const wrapper = mount( <FileListDisplay { ...newProps } /> );
    const loader = wrapper.find( 'Loader' );

    expect( loader.exists() ).toEqual( true );
    expect( wrapper.contains( 'Loading...' ) ).toEqual( true );
  } );

  it( 'renders an error message if an error is present', () => {
    const newProps = { ...props, error: { message: 'Oops' } };
    const errorMsg = `Error occurred with ${newProps.fileType} request.`;

    const wrapper = mount( <FileListDisplay { ...newProps } /> );
    const error = wrapper.find( 'li.error-message' );

    expect( error.exists() ).toEqual( true );
    expect( error.contains( errorMsg ) ).toEqual( true );
  } );
} );
