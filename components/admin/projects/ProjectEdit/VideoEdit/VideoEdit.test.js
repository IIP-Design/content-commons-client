import { mount, shallow } from 'enzyme';
import Link from 'next/link';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';
import VideoEdit, { DELETE_VIDEO_PROJECT_MUTATION, VIDEO_PROJECT_QUERY } from './VideoEdit';

/**
 * Because `<VideoEdit />` is mounted in the tests, `<SupportItem />`
 * is also being mounted as a child component, which causes its
 * `componentDidMount` lifecycle method to be called and its state
 * to be set on `undefined` data.
 *
 * This `<SupportItem />` stub is mounted instead of the actual
 * component, which prevents random tests from failing because of
 * its `componentDidMount`'s attempt to set state on `undefined` data.
 */
jest.mock(
  'components/admin/projects/ProjectEdit/SupportItem/SupportItem',
  /* eslint-disable react/display-name */
  () => () => <div />
);

const props = { id: '234' };

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          videos: [
            { id: 'aaa' },
            { id: 'bbb' },
            { id: 'ccc' }
          ],
          srt: [
            { id: '111' },
            { id: '222' },
            { id: '333' }
          ],
          other: [
            { id: '444' },
            { id: '555' },
            { id: '666' },
            { id: '777' }
          ]
        }
      }
    }
  },
  {
    request: {
      query: DELETE_VIDEO_PROJECT_MUTATION,
      variables: { id: props.id }
    },
    result: {
      data: { deleteVideoProject: { id: props.id } }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VideoEdit { ...props } />
  </MockedProvider>
);


describe( '<VideoEdit />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoEdit = wrapper.find( 'VideoEdit' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading the project..."
      />
    );

    expect( videoEdit.exists() ).toEqual( true );
    expect( videoEdit.contains( loader ) ).toEqual( true );
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks }>
        <VideoEdit { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const div = videoEdit.find( 'div.video-edit.error' );
    const icon = (
      <Icon
        color="red"
        name="exclamation triangle"
        content="Loading error..."
      />
    );

    expect( div.exists() ).toEqual( true );
    expect( videoEdit.contains( icon ) ).toEqual( true );
  } );

  it( 'redirects to <ProjectNotFound /> if project is `null`', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_PROJECT_QUERY,
          variables: { id: props.id }
        },
        result: { data: { project: null } }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks }>
        <VideoEdit { ...props } />
      </MockedProvider>
    );

    const pageNotFound = shallow( <ProjectNotFound /> );

    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const notFoundMsg = <p>The project you’re looking for doesn’t exist.</p>;
    const dashboardLink = (
      <p>Go to my <Link href="/admin/dashboard"><a>project dashboard</a></Link>.</p>
    );

    expect( videoEdit.exists() ).toEqual( true );
    expect( pageNotFound.exists() ).toEqual( true );
    expect( pageNotFound.contains( notFoundMsg ) ).toEqual( true );
    expect( pageNotFound.contains( dashboardLink ) ).toEqual( true );
  } );

  it( '`componentDidMount` sets `_isMounted`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    inst.componentDidMount();

    expect( inst._isMounted ).toEqual( true );
  } );

  it( '`componentDidMount` sets `filesToUploadCount` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    inst.componentDidMount();

    expect( inst.state.filesToUploadCount )
      .toEqual( inst.getFilesToUploadCount() );
  } );

  it( '`componentWillUnmount` sets `_isMounted` to false', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    inst.componentWillUnmount();

    expect( inst._isMounted ).toEqual( false );
  } );

  it( '`componentWillUnmount` calls `clearTimeout`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    window.clearTimeout = jest.fn();

    inst.componentWillUnmount();

    expect( window.clearTimeout ).toHaveBeenCalledTimes( 2 );
    expect( window.clearTimeout )
      .toHaveBeenCalledWith( inst.uploadSuccessTimer );
    expect( window.clearTimeout )
      .toHaveBeenCalledWith( inst.saveMsgTimer );
  } );

  it( '`getVideosCount` returns the total number of videos', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const videosCount = inst.props.data.project.videos.length;

    expect( inst.getVideosCount() ).toEqual( videosCount );
  } );

  it( '`getSupportFilesCount` returns the total number of support files', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const supportFilesCount = inst.getSupportFilesCount();
    const srtCount = inst.props.data.project.srt.length;
    const otherCount = inst.props.data.project.other.length;

    expect( supportFilesCount ).toEqual( srtCount + otherCount );
  } );

  it( '`filesToUploadCount` state is set on mount', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const totalFilesCount = inst.getFilesToUploadCount();

    inst.componentDidMount();

    expect( inst.state.filesToUploadCount ).toEqual( totalFilesCount );
  } );

  it( '`getUploadedFilesCount` returns total files uploaded', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.componentDidMount();
    inst.setState( {
      uploadedVideosCount: 3,
      uploadedSupportFilesCount: 4
    } );
    const totalFilesUploadedCount = inst.getUploadedFilesCount();

    expect( totalFilesUploadedCount ).toEqual( 7 );
  } );

  it( '`displayConfirmDelete` sets `deleteConfirmOpen` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.displayConfirmDelete();

    expect( inst.state.deleteConfirmOpen ).toEqual( true );
  } );

  it( '`handleDeleteCancel` sets `deleteConfirmOpen` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.handleDeleteCancel();

    expect( inst.state.deleteConfirmOpen ).toEqual( false );
  } );

  it( '`handleAddMoreFiles` results in `addMoreInputRef` being clicked', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    inst.addMoreInputRef = { click: jest.fn() };
    inst.handleAddMoreFiles();

    expect( inst.addMoreInputRef.click ).toHaveBeenCalled();
  } );

  it( '`handleFinalReview` redirects to the Video Review page', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    Router.push = jest.fn();
    inst.handleFinalReview();

    expect( Router.push ).toHaveBeenCalledWith( {
      pathname: `/admin/project/video/${props.id}`
    } );
  } );

  it( 'assigns `addMoreInputRef` to the file `input` element', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    inst.setState( { hasSubmittedData: true } );

    expect( inst.state.hasSubmittedData ).toEqual( true );
    expect( inst.addMoreInputRef ).toBeTruthy();
    expect( inst.addMoreInputRef.id )
      .toEqual( 'upload-item--multiple' );
    expect( inst.addMoreInputRef.type ).toEqual( 'file' );
    expect( inst.addMoreInputRef.multiple ).toEqual( true );
    expect( inst.addMoreInputRef.accept )
      .toEqual( '.mov, .mp4, .mpg, .wmv, .avi' );
  } );

  it( '`handleDisplayUploadSuccessMsg` sets `displayTheUploadSuccessMsg` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.handleDisplayUploadSuccessMsg();

    expect( inst._isMounted ).toEqual( true );
    expect( inst.state.displayTheUploadSuccessMsg ).toEqual( false );
    expect( inst.uploadSuccessTimer ).toEqual( null );
  } );

  it( '`handleDisplaySaveMsg` sets `displaySaveMsg` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.handleDisplaySaveMsg();

    expect( inst._isMounted ).toEqual( true );
    expect( inst.state.displayTheUploadSuccessMsg ).toEqual( false );
    expect( inst.saveMsgTimer ).toEqual( null );
  } );

  it( '`handleUpload` sets `isUploadInProgress` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.handleUpload();

    expect( inst.state.isUploadInProgress ).toEqual( true );
  } );

  it( '`handleSaveDraft` calls `handleSubmit`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'handleSubmit' );
    const e = { preventDefault: jest.fn() };
    window.scrollTo = jest.fn();

    inst.forceUpdate();
    inst.handleSaveDraft( e );

    expect( spy ).toHaveBeenCalledWith( e );
  } );

  it( '`getTags` returns an array of tag values', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.setState( {
      formData: {
        ...inst.state.formData,
        tags: 'a, b'
      }
    } );

    expect( inst.getTags() ).toEqual( ['a', 'b'] );

    inst.setState( {
      formData: {
        ...inst.state.formData,
        tags: ['one', 'two', 'three']
      }
    } );

    expect( inst.getTags() ).toEqual( ['one', 'two', 'three'] );
  } );

  it( 'renders <Progress /> if `isUploadInProgress`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = () => wrapper.find( 'VideoEdit' );
    const progress = () => videoEdit().find( 'Progress' );
    const inst = () => videoEdit().instance();

    inst().setState( { isUploadInProgress: true } );
    wrapper.update();

    expect( progress() ).toHaveLength( 2 );
  } );

  it( 'clicking the "Add more files" button calls `handleAddMoreFiles`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'handleAddMoreFiles' );

    inst.setState( { hasSubmittedData: true } );
    wrapper.update();

    const addMoreBtn = wrapper.find( 'Button.edit-project__add-more' );
    addMoreBtn.simulate( 'click' );

    expect( addMoreBtn.exists() ).toEqual( true );
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'clicking "Delete Project" button calls `displayConfirmDelete`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'displayConfirmDelete' );

    inst.setState( { isUploadFinished: true } );
    wrapper.update();

    const deleteBtn = wrapper.find( 'Button.edit-project__btn--delete' );
    deleteBtn.simulate( 'click' );

    expect( deleteBtn.exists() ).toEqual( true );
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'clicking Cancel in <Confirm /> calls `handleDeleteCancel`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'handleDeleteCancel' );

    inst.setState( { isUploadFinished: true, deleteConfirmOpen: true } );
    wrapper.update();

    const confirmModal = wrapper.find( 'Confirm' );
    const cancelDeleteBtn = confirmModal
      .find( 'Button[content="No, take me back"]' );

    cancelDeleteBtn.simulate( 'click' );

    expect( confirmModal.exists() ).toEqual( true );
    expect( cancelDeleteBtn.exists() ).toEqual( true );
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'clicking Confirm in <Confirm /> calls `handleDeleteConfirm` and redirects to the dashboard', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'handleDeleteConfirm' );

    inst.setState( { isUploadFinished: true, deleteConfirmOpen: true } );
    wrapper.update();

    const confirmModal = wrapper.find( 'Confirm' );
    const confirmDeleteBtn = confirmModal
      .find( 'Button[content="Yes, delete forever"]' );
    Router.push = jest.fn();

    confirmDeleteBtn.simulate( 'click' );

    expect( confirmModal.exists() ).toEqual( true );
    expect( confirmDeleteBtn.exists() ).toEqual( true );
    expect( spy ).toHaveBeenCalled();
    expect( Router.push )
      .toHaveBeenCalledWith( { pathname: '/admin/dashboard' } );
  } );

  it( 'clicking "Final Review" button calls `handleFinalReview`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'handleFinalReview' );

    inst.setState( { isUploadFinished: true } );
    wrapper.update();

    const finalReviewBtn = wrapper
      .find( 'Button.edit-project__btn--final-review' );
    Router.push = jest.fn();

    finalReviewBtn.simulate( 'click' );

    expect( finalReviewBtn.exists() ).toEqual( true );
    expect( spy ).toHaveBeenCalled();
    expect( Router.push ).toHaveBeenCalledWith( {
      pathname: `/admin/project/video/${props.id}`
    } );
  } );

  it( 'header buttons are disabled until `isUploadFinished`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = () => wrapper.find( 'VideoEdit' );
    const header = () => videoEdit().find( 'ProjectHeader' );
    const btns = () => header().find( 'Button' );
    const inst = () => videoEdit().instance();

    btns().forEach( btn => {
      expect( btn.prop( 'disabled' ) ).toEqual( true );
    } );

    inst().setState( { isUploadFinished: true } );
    wrapper.update();

    btns().forEach( btn => {
      expect( btn.prop( 'disabled' ) ).toEqual( false );
    } );
  } );

  it( 'renders disabled "Save Draft" button if `hasSubmittedData`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const saveDraftBtn = () => wrapper.find( 'Button.edit-project__btn--save-draft' );
    const inst = videoEdit.instance();

    expect( saveDraftBtn().exists() ).toEqual( false );

    inst.setState( { hasSubmittedData: true } );
    wrapper.update();

    expect( saveDraftBtn().exists() ).toEqual( true );
    expect( saveDraftBtn().prop( 'disabled' ) ).toEqual( true );
  } );

  it( 'renders enabled "Save Draft" button if `isUploadFinished && hasUnsavedData && hasRequiredData`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const saveDraftBtn = () => wrapper.find( 'Button.edit-project__btn--save-draft' );
    const inst = videoEdit.instance();

    expect( saveDraftBtn().exists() ).toEqual( false );

    inst.setState( {
      hasSubmittedData: true,
      isUploadFinished: true,
      hasUnsavedData: true,
      hasRequiredData: true
    } );
    wrapper.update();

    expect( saveDraftBtn().exists() ).toEqual( true );
    expect( saveDraftBtn().prop( 'disabled' ) ).toEqual( false );
  } );

  it( 'renders <FormInstructions /> if `!hasSubmittedData`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const formInstructions = () => wrapper.find( 'FormInstructions' );
    const p1 = <strong>Fill out the required fields to finish setting up this project.</strong>;
    const p2 = 'Your files will not be uploaded until the project is saved as a draft.';

    expect( formInstructions().exists() ).toEqual( true );
    expect( formInstructions().contains( p1 ) ).toEqual( true );
    expect( formInstructions().contains( p2 ) ).toEqual( true );

    inst.setState( { hasSubmittedData: true } );
    wrapper.update();

    expect( formInstructions().exists() ).toEqual( false );
  } );

  it( 'renders <Notification /> with project saved message if `displaySaveMsg`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.setState( { displaySaveMsg: true } );
    wrapper.update();

    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( true );
    expect( notification.contains( 'Project saved as draft' ) )
      .toEqual( true );
  } );

  it( 'renders <Notification /> with unsaved data message if `hasUnsavedData && hasSubmittedData`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.setState( {
      hasRequiredData: true, // must be true if hasSubmittedData
      hasUnsavedData: true,
      hasSubmittedData: true
    } );
    wrapper.update();

    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( true );
    expect( notification.contains( 'You have unsaved data' ) )
      .toEqual( true );
  } );

  it( 'renders <Notification /> with saving message if `isUploadInProgress`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.setState( {
      isUploadInProgress: true,
      displaySaveMsg: true,
      hasSubmittedData: true
    } );
    wrapper.update();

    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( true );
    expect( notification.contains( 'Saving project...' ) )
      .toEqual( true );
  } );

  it( 'renders <Notification /> with fill in required data message if `hasSubmittedData && hasUnsavedData && !hasRequiredData`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();

    inst.setState( {
      displaySaveMsg: true,
      hasRequiredData: false,
      hasUnsavedData: true,
      hasSubmittedData: true
    } );
    wrapper.update();

    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( true );
    expect( notification.contains( 'Please fill in required data' ) )
      .toEqual( true );
  } );

  it( '`handleSubmit` calls `handleSaveProjectData`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'handleSaveProjectData' );
    const e = { preventDefault: jest.fn() };

    inst.handleSubmit( e );

    expect( spy ).toHaveBeenCalled();
  } );

  it( '`handleSubmit` calls `window.scrollTo`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    window.scrollTo = jest.fn();
    const e = { preventDefault: jest.fn() };

    inst.handleSubmit( e );

    expect( window.scrollTo )
      .toHaveBeenCalledWith( { top: 0, behavior: 'smooth' } );
  } );

  it( '`handleSubmit` calls `handleUpload` if `!isUploadFinished`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'handleUpload' );
    const e = { preventDefault: jest.fn() };

    inst.setState( { isUploadFinished: false } );
    inst.handleSubmit( e );

    expect( inst.state.isUploadFinished ).toEqual( false );
    expect( spy ).toHaveBeenCalled();
  } );

  it( '`handleSubmit` calls `delayUnmount` if `isUploadFinished`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const spy = jest.spyOn( inst, 'delayUnmount' );
    const e = { preventDefault: jest.fn() };

    inst.setState( { isUploadFinished: true } );
    inst.handleSubmit( e );

    expect( inst.state.isUploadFinished ).toEqual( true );
    expect( spy ).toHaveBeenCalledWith( inst.handleDisplaySaveMsg, inst.saveMsgTimer, inst.SAVE_MSG_DELAY );
  } );

  it( '`handleSubmit` sets `hasSubmittedData`, `hasUnsavedData`, & `displaySaveMsg` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const e = { preventDefault: jest.fn() };

    inst.handleSubmit( e );

    expect( inst.state.hasSubmittedData ).toEqual( true );
    expect( inst.state.hasUnsavedData ).toEqual( false );
    expect( inst.state.displaySaveMsg ).toEqual( true );
  } );

  it( '`handleChange` sets state for form inputs, `hasUnsavedData`, `hasExceededMaxCategories`, & `hasRequiredData` ', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoEdit = wrapper.find( 'VideoEdit' );
    const inst = videoEdit.instance();
    const e = {};
    const textInput = { name: 'projectTitle', value: 'test title' };
    const checkboxInput = { name: 'termsConditions', checked: true };
    const catDropdownValid = {
      name: 'categories',
      value: ['one', 'two']
    };
    const catDropdownInvalid = {
      name: 'categories',
      value: ['one', 'two', 'three']
    };

    expect( inst.state.formData.projectTitle ).toEqual( '' );
    expect( inst.state.formData.termsConditions ).toEqual( false );
    expect( inst.state.hasUnsavedData ).toEqual( false );
    expect( inst.state.hasExceededMaxCategories ).toEqual( false );
    expect( inst.state.hasRequiredData ).toEqual( false );

    inst.handleChange( e, textInput );
    expect( inst.state.formData.projectTitle ).toEqual( textInput.value );
    expect( inst.state.hasUnsavedData ).toEqual( true );
    expect( inst.state.hasExceededMaxCategories )
      .toEqual(
        inst.state.formData.categories.length > inst.MAX_CATEGORY_COUNT
      );
    expect( inst.state.hasRequiredData ).toEqual( false );

    inst.handleChange( e, checkboxInput );
    expect( inst.state.formData.termsConditions )
      .toEqual( checkboxInput.checked );
    expect( inst.state.hasUnsavedData ).toEqual( true );
    expect( inst.state.hasExceededMaxCategories ).toEqual( false );
    expect( inst.state.hasRequiredData ).toEqual( false );

    inst.handleChange( e, catDropdownValid );
    expect( inst.state.hasUnsavedData ).toEqual( true );
    expect( inst.state.hasExceededMaxCategories ).toEqual( false );
    expect( inst.state.hasRequiredData ).toEqual( true );

    inst.handleChange( e, catDropdownInvalid );
    expect( inst.state.hasUnsavedData ).toEqual( true );
    expect( inst.state.hasExceededMaxCategories ).toEqual( true );
    expect( inst.state.hasRequiredData ).toEqual( false );
  } );
} );
