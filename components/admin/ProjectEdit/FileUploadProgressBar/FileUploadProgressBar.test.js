import { mount } from 'enzyme';
import FileUploadProgressBar from './FileUploadProgressBar';

const startUploadProps = {
  filesToUpload: [
    {
      language: 'cjsq439dz005607560gwe7k3m',
      use: 'cjtkdq8kr0knf07569goo9eqe',
      quality: '',
      videoBurnedInStatus: '',
      input: {
        name: 'Mexico City 1.jpg',
        lastModified: 1517162382000,
        size: 1030591,
        type: 'image/jpeg'
      },
      id: '3ecbfa03-a821-4e20-b593-bf17cb4d695d',
      loaded: 0
    },
    {
      language: 'cjsq439dz005607560gwe7k3m',
      use: 'cjsw78q6p00lp07566znbyatd',
      quality: 'BROADCAST',
      videoBurnedInStatus: 'CLEAN',
      input: {
        name: 'Mexico City 1.mp4',
        lastModified: 1517162208000,
        size: 15829673,
        type: 'video/mp4'
      },
      id: 'af1557de-c2ad-4107-bcd3-369f05779320',
      loaded: 0
    },
    {
      language: 'cjsq439dz005607560gwe7k3m',
      use: '',
      quality: '',
      videoBurnedInStatus: '',
      input: {
        name: 'Mexico City 1.srt',
        lastModified: 1560876777094,
        size: 5000,
        type: ''
      },
      id: '41fe4a83-892c-47a4-b96f-adbe93811290',
      loaded: 0
    }
  ],
  fileProgessMessage: true,
  label: 'just another label',
  onComplete: jest.fn()
};

const partialUploadProps = {
  ...startUploadProps,
  filesToUpload: [
    { ...startUploadProps.filesToUpload[0], loaded: 1019591 },
    { ...startUploadProps.filesToUpload[1], loaded: 4748902 },
    { ...startUploadProps.filesToUpload[2], loaded: 5000 },
  ]
};

const completedUploadProps = {
  ...startUploadProps,
  filesToUpload: [
    { ...startUploadProps.filesToUpload[0], loaded: 1030591 },
    { ...startUploadProps.filesToUpload[1], loaded: 15829673 },
    { ...startUploadProps.filesToUpload[2], loaded: 5000 },
  ]
};

const StartUploadComponent = <FileUploadProgressBar { ...startUploadProps } />;
const PartialUploadComponent = <FileUploadProgressBar { ...partialUploadProps } />;
const CompletedUploadComponent = <FileUploadProgressBar { ...completedUploadProps } />;

describe( '<FileUploadProgressBar /> at upload start', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( StartUploadComponent );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the label and progress message', () => {
    const wrapper = mount( StartUploadComponent );
    const progressLabel = wrapper.find( '.file-progress--label' );
    const { filesToUpload, label } = startUploadProps;
    const completed = filesToUpload.filter( file => file.loaded === file.input.size ).length;
    const progressMsg = <div><b>Uploading files:</b> { completed + 1 } of { filesToUpload.length }</div>;

    expect( progressLabel.contains( label ) ).toEqual( true );
    expect( progressLabel.contains( progressMsg ) ).toEqual( true );
  } );

  it( 'renders with the correct total file size', () => {
    const wrapper = mount( StartUploadComponent );
    const progress = wrapper.find( 'Progress' );
    const size = startUploadProps.filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.input.size, 0
    );

    expect( progress.prop( 'total' ) ).toEqual( size );
  } );

  it( 'renders with the correct progress bar value and percentage', () => {
    const wrapper = mount( StartUploadComponent );
    const progress = wrapper.find( 'Progress' );
    const progressDiv = wrapper.find( 'Progress > div.progress' );
    const { filesToUpload } = startUploadProps;
    const size = filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.input.size, 0
    );
    const value = filesToUpload.reduce(
      // 0 + 0 + 0 = 0
      ( acc, curr ) => acc + curr.loaded, 0
    );
    const percent = Math.round( ( value / size ) * 100 );

    expect( progress.prop( 'value' ) ).toEqual( value );
    expect( progressDiv.prop( 'data-percent' ) ).toEqual( percent );
  } );

  it( 'renders with the percentage if props.showPercent', () => {
    const wrapper = mount( StartUploadComponent );
    wrapper.setProps( { showPercent: true } );

    const { filesToUpload } = startUploadProps;
    const size = filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.input.size, 0
    );
    const value = filesToUpload.reduce(
      // 0 + 0 + 0 = 0
      ( acc, curr ) => acc + curr.loaded, 0
    );
    const percent = <span>{ `${Math.round( ( value / size ) * 100 )}%` }</span>;

    expect( wrapper.prop( 'showPercent' ) ).toEqual( true );
    expect( wrapper.contains( percent ) ).toEqual( true );
  } );
} );

describe( '<FileUploadProgressBar /> during upload', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( PartialUploadComponent );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the label and progress message', () => {
    const wrapper = mount( PartialUploadComponent );
    const progressLabel = wrapper.find( '.file-progress--label' );
    const { filesToUpload, label } = partialUploadProps;
    const completed = filesToUpload.filter( file => file.loaded === file.input.size ).length;
    const progressMsg = <div><b>Uploading files:</b> { completed + 1 } of { filesToUpload.length }</div>;

    expect( progressLabel.contains( label ) ).toEqual( true );
    expect( progressLabel.contains( progressMsg ) ).toEqual( true );
  } );

  it( 'renders with the correct total file size', () => {
    const wrapper = mount( PartialUploadComponent );
    const progress = wrapper.find( 'Progress' );
    const size = partialUploadProps.filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.input.size, 0
    );

    expect( progress.prop( 'total' ) ).toEqual( size );
  } );

  it( 'renders with the correct progress bar value and percentage', () => {
    const wrapper = mount( PartialUploadComponent );
    const progress = wrapper.find( 'Progress' );
    const progressDiv = wrapper.find( 'Progress > div.progress' );
    const { filesToUpload } = partialUploadProps;
    const size = filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.input.size, 0
    );
    const value = filesToUpload.reduce(
      // 1019591 + 4748902 + 5000 = 5773493
      ( acc, curr ) => acc + curr.loaded, 0
    );
    const percent = Math.round( ( value / size ) * 100 );

    expect( progress.prop( 'value' ) ).toEqual( value );
    expect( progressDiv.prop( 'data-percent' ) ).toEqual( percent );
  } );

  it( 'renders with the percentage if props.showPercent', () => {
    const wrapper = mount( PartialUploadComponent );
    wrapper.setProps( { showPercent: true } );

    const { filesToUpload } = partialUploadProps;
    const size = filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.input.size, 0
    );
    const value = filesToUpload.reduce(
      // 1019591 + 4748902 + 5000 = 5773493
      ( acc, curr ) => acc + curr.loaded, 0
    );
    const percent = <span>{ `${Math.round( ( value / size ) * 100 )}%` }</span>;

    expect( wrapper.prop( 'showPercent' ) ).toEqual( true );
    expect( wrapper.contains( percent ) ).toEqual( true );
  } );
} );

describe( '<FileUploadProgressBar /> after completed upload', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( CompletedUploadComponent );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the label and saving message', () => {
    const wrapper = mount( CompletedUploadComponent );
    const progressLabel = wrapper.find( '.file-progress--label' );
    const { label } = completedUploadProps;
    const savingMsg = <b>Saving file metadata</b>;

    expect( progressLabel.contains( label ) ).toEqual( true );
    expect( progressLabel.contains( savingMsg ) ).toEqual( true );
  } );

  it( 'renders with the correct progress bar value and percentage', () => {
    const wrapper = mount( CompletedUploadComponent );
    const progress = wrapper.find( 'Progress' );
    const progressDiv = wrapper.find( 'Progress > div.progress' );
    const { filesToUpload } = completedUploadProps;
    const size = filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.input.size, 0
    );
    const value = filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.loaded, 0
    );
    const percent = Math.round( ( value / size ) * 100 );

    expect( progress.prop( 'value' ) ).toEqual( value );
    expect( progressDiv.prop( 'data-percent' ) ).toEqual( percent );
  } );

  it( 'renders with the percentage if props.showPercent', () => {
    const wrapper = mount( CompletedUploadComponent );
    wrapper.setProps( { showPercent: true } );

    const { filesToUpload } = completedUploadProps;
    const size = filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.input.size, 0
    );
    const value = filesToUpload.reduce(
      // 1030591 + 15829673 + 5000 = 16865264
      ( acc, curr ) => acc + curr.loaded, 0
    );
    const percent = <span>{ `${Math.round( ( value / size ) * 100 )}%` }</span>;

    expect( wrapper.prop( 'showPercent' ) ).toEqual( true );
    expect( wrapper.contains( percent ) ).toEqual( true );
  } );
} );
