import { mount } from 'enzyme';
import { UploadContext } from '../VideoEdit/VideoEdit';
import ProjectUnitItem from './ProjectUnitItem';
import { filesToUpload, postUploadUnit, preUploadUnit } from './mocks';

jest.mock( 'next-server/dynamic', () => () => 'Dynamic' );

jest.mock( 'next-server/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_PUBLISHER_BUCKET: 's3-bucket-url' } } ) );

jest.mock(
  '../EditSingleProjectItem/EditSingleProjectItem',
  () => function EditSingleProjectItem() { return ''; }
);

jest.mock(
  'components/admin/ProjectEdit/FileUploadProgressBar/FileUploadProgressBar',
  () => function FileUploadProgressBar() { return ''; }
);

jest.mock(
  'static/icons/icon_32px_videoCamera.png',
  () => 'iconVideoCamera'
);

const uploadingProps = {
  projectId: undefined,
  filesToUpload,
  unit: preUploadUnit
};

const postUploadProps = {
  projectId: '123',
  filesToUpload: [],
  unit: postUploadUnit
};

const updateTitleProps = {
  ...postUploadProps,
  unit: {
    ...postUploadUnit,
    title: 'the project title'
  }
};

const uploadingErrorProps = {
  ...uploadingProps,
  unit: {
    ...uploadingProps.unit,
    files: [
      { ...uploadingProps.unit.files[0], error: true },
    ]
  }
};

const postUploadErrorProps = {
  ...postUploadProps,
  unit: {
    ...postUploadProps.unit,
    files: [
      {
        ...postUploadProps.unit.files[0],
        duration: null,
        dimensions: {
          ...postUploadProps.unit.files[0].dimensions,
          width: null,
          height: null
        },
        stream: [
          {
            ...postUploadProps.unit.files[0].stream[0],
            url: null
          }
        ]
      }
    ]
  }
};

const UploadingComponent = (
  <UploadContext.Provider value>
    <ProjectUnitItem { ...uploadingProps } />
  </UploadContext.Provider>
);

const UploadingErrorComponent = (
  <UploadContext.Provider value>
    <ProjectUnitItem { ...uploadingErrorProps } />
  </UploadContext.Provider>
);

const PostUploadComponent = (
  <UploadContext.Provider value={ false }>
    <ProjectUnitItem { ...postUploadProps } />
  </UploadContext.Provider>
);

const PostUploadErrorComponent = (
  <UploadContext.Provider value={ false }>
    <ProjectUnitItem { ...postUploadErrorProps } />
  </UploadContext.Provider>
);

const UpdateTitleComponent = (
  <UploadContext.Provider value={ false }>
    <ProjectUnitItem { ...updateTitleProps } />
  </UploadContext.Provider>
);

describe( '<ProjectUnitItem /> during uploading', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( UploadingComponent );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the Loader', () => {
    const wrapper = mount( UploadingComponent );
    const loader = wrapper.find( 'Loader' );

    expect( loader.exists() ).toEqual( true );
    expect( loader.prop( 'active' ) ).toEqual( true );
  } );

  it( 'renders the FileUploadProgressBar', () => {
    const wrapper = mount( UploadingComponent );
    const progressBar = wrapper.find( 'FileUploadProgressBar' );
    const { filesToUpload: files } = uploadingProps;

    expect( progressBar.exists() ).toEqual( true );
    expect( progressBar.prop( 'filesToUpload' ) ).toEqual( files );
  } );

  it( 'renders the list of files to upload', () => {
    const wrapper = mount( UploadingComponent );
    const fileList = wrapper.find( 'List.file-list' );
    const { filesToUpload: files } = uploadingProps;

    expect( fileList.exists() ).toEqual( true );
    expect( fileList.length ).toEqual( files.length );
    fileList.forEach( ( file, i ) => {
      const { name } = files[i].input;
      expect( file.contains( name ) ).toEqual( true );
    } );
  } );

  it( 'renders a placeholder thumbnail', () => {
    const wrapper = mount( UploadingComponent );
    const imageWrapper = wrapper.find( '.image-wrapper' );
    const placeholder = <div className="placeholder" />;

    expect( imageWrapper.exists() ).toEqual( true );
    expect( imageWrapper.contains( placeholder ) ).toEqual( true );
  } );

  it( 'renders the placeholder title', () => {
    const wrapper = mount( UploadingComponent );
    const header = wrapper.find( 'CardHeader > .header' );

    expect( header.exists() ).toEqual( true );
    expect( header.text() ).toEqual( '[Title]' );
  } );

  it( 'does not render the Modal', () => {
    const wrapper = mount( UploadingComponent );
    const modal = wrapper.find( 'Modal' );

    expect( wrapper.prop( 'projectId' ) ).toEqual( undefined );
    expect( modal.exists() ).toEqual( false );
  } );
} );

describe( '<ProjectUnitItem /> during uploading error', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( UploadingErrorComponent );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the video icon', () => {
    const wrapper = mount( UploadingErrorComponent );
    const img = wrapper.find( 'img.metaicon' );

    expect( img.exists() ).toEqual( false );
  } );

  it( 'does not render the Modal', () => {
    const wrapper = mount( UploadingErrorComponent );
    const modal = wrapper.find( 'Modal' );

    expect( modal.exists() ).toEqual( false );
  } );

  it( 'renders the GeneralError component', () => {
    const wrapper = mount( UploadingErrorComponent );
    const generalError = wrapper.find( 'GeneralError' );

    expect( generalError.exists() ).toEqual( true );
  } );

  it( 'assigns an error class value to CardContent', () => {
    const wrapper = mount( UploadingErrorComponent );
    const cardContent = wrapper.find( 'CardContent' );

    expect( cardContent.hasClass( 'error' ) ).toEqual( true );
  } );
} );

describe( '<ProjectUnitItem /> after upload completion', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( PostUploadComponent );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Loader', () => {
    const wrapper = mount( PostUploadComponent );
    const loader = wrapper.find( 'Loader' );

    expect( loader.exists() ).toEqual( false );
  } );

  it( 'does not render the FileUploadProgressBar', () => {
    const wrapper = mount( PostUploadComponent );
    const progressBar = wrapper.find( 'FileUploadProgressBar' );

    expect( progressBar.exists() ).toEqual( false );
  } );

  it( 'does not render the list of files to upload', () => {
    const wrapper = mount( PostUploadComponent );
    const fileList = wrapper.find( 'List.file-list' );

    expect( fileList.exists() ).toEqual( false );
  } );

  it( 'renders the thumbnail', () => {
    const wrapper = mount( PostUploadComponent );
    const imageWrapper = wrapper.find( '.image-wrapper' );
    const image = wrapper.find( 'Image > img' );
    const placeholder = <div className="placeholder" />;
    const { url } = postUploadProps.unit.thumbnails[0].image;
    const src = `https://s3-bucket-url.s3.amazonaws.com/${url}`;

    expect( imageWrapper.exists() ).toEqual( true );
    expect( imageWrapper.contains( placeholder ) ).toEqual( false );
    expect( image.exists() ).toEqual( true );
    expect( image.prop( 'src' ) ).toEqual( src );
  } );

  it( 'renders initially the placeholder title', () => {
    const wrapper = mount( PostUploadComponent );
    const header = wrapper.find( 'CardHeader > .header' );

    expect( header.exists() ).toEqual( true );
    expect( header.text() ).toEqual( '[Title]' );
  } );

  it( 'renders the updated project title', () => {
    const wrapper = mount( UpdateTitleComponent );
    const header = wrapper.find( 'CardHeader > .header' );
    const { title } = updateTitleProps.unit;

    expect( header.exists() ).toEqual( true );
    expect( header.text() ).not.toEqual( '[Title]' );
    expect( header.text() ).toEqual( title );
  } );

  it( 'renders the Modal', () => {
    const wrapper = mount( PostUploadComponent );
    const modal = wrapper.find( 'Modal' );
    const { projectId } = postUploadProps;

    expect( wrapper.prop( 'projectId' ) ).toEqual( projectId );
    expect( modal.exists() ).toEqual( true );
  } );
} );

describe( '<ProjectUnitItem /> after upload completion error', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( PostUploadErrorComponent );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the video icon', () => {
    const wrapper = mount( PostUploadErrorComponent );
    const img = wrapper.find( 'img.metaicon' );

    expect( img.exists() ).toEqual( false );
  } );

  it( 'does not render the Modal', () => {
    const wrapper = mount( PostUploadErrorComponent );
    const modal = wrapper.find( 'Modal' );

    expect( modal.exists() ).toEqual( false );
  } );

  it( 'renders the GeneralError component', () => {
    const wrapper = mount( PostUploadErrorComponent );
    const generalError = wrapper.find( 'GeneralError' );

    expect( generalError.exists() ).toEqual( true );
  } );

  it( 'assigns an error class value to CardContent', () => {
    const wrapper = mount( PostUploadErrorComponent );
    const cardContent = wrapper.find( 'CardContent' );

    expect( cardContent.hasClass( 'error' ) ).toEqual( true );
  } );
} );
