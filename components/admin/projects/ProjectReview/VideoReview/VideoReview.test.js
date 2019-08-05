import { mount, shallow } from 'enzyme';
import Link from 'next/link';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';
import VideoReview from './VideoReview';
import {
  errorMocks, mocks, nullMocks, props, publishedMocks
} from './mocks';

jest.mock( 'components/admin/projects/ProjectEdit/ProjectUnitItem/ProjectUnitItem', () => function ProjectUnitItem() {
  return <div>ProjectUnitItem</div>;
} );

jest.mock( 'next-server/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET: 's3-bucket-url' } } ) );

jest.mock(
  'components/admin/projects/ProjectReview/VideoProjectData/VideoProjectData',
  () => function VideoProjectData() {
    return <div>VideoProjectData</div>;
  }
);

jest.mock(
  'components/admin/projects/ProjectReview/VideoSupportFiles/VideoSupportFiles',
  () => function VideoSupportFiles() {
    return <div>VideoSupportFiles</div>;
  }
);

jest.mock(
  'components/admin/projects/ProjectReview/VideoProjectFiles/VideoProjectFiles',
  () => function VideoProjectFiles() {
    return <div>VideoProjectFiles</div>;
  }
);

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <VideoReview { ...props } />
  </MockedProvider>
);

describe( '<VideoReview />', () => {
  /**
   * @todo Suppress React 16.8 `act()` warnings globally.
   * The React team's fix won't be out of alpha until 16.9.0.
   * @see https://github.com/facebook/react/issues/14769
   */
  const consoleError = console.error;
  beforeAll( () => {
    jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
      if ( !args[0].includes( 'Warning: An update to %s inside a test was not wrapped in act' ) ) {
        consoleError( ...args );
      }
    } );
  } );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoReview = wrapper.find( 'VideoReview' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading the project..."
      />
    );

    expect( videoReview.exists() ).toEqual( true );
    expect( videoReview.contains( loader ) ).toEqual( true );
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename>
        <VideoReview { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const div = videoReview.find( 'div.video-review-project.error' );
    const icon = <Icon color="red" name="exclamation triangle" />;
    const span = <span>Loading error...</span>;

    expect( div.exists() ).toEqual( true );
    expect( videoReview.contains( icon ) ).toEqual( true );
    expect( videoReview.contains( span ) ).toEqual( true );
  } );

  it( 'renders ApolloError', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const apolloError = wrapper.find( 'ApolloError' );

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.prop( 'error' ) ).toEqual( null );
  } );

  it( 'redirects to <ProjectNotFound /> if project is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename>
        <VideoReview { ...props } />
      </MockedProvider>
    );

    const pageNotFound = shallow( <ProjectNotFound /> );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const notFoundMsg = <p>The project you’re looking for doesn’t exist.</p>;
    const dashboardLink = (
      <p>Go to my <Link href="/admin/dashboard"><a>project dashboard</a></Link>.</p>
    );

    expect( videoReview.exists() ).toEqual( true );
    expect( pageNotFound.exists() ).toEqual( true );
    expect( pageNotFound.contains( notFoundMsg ) ).toEqual( true );
    expect( pageNotFound.contains( dashboardLink ) ).toEqual( true );
  } );

  it( 'clicking an Edit button redirects to <VideoEdit />', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const editBtns = videoReview.find( 'Button.project_button--edit' );
    Router.push = jest.fn();
    const prettyPath = `/admin/project/video/${props.id}/edit`;
    const path = {
      pathname: '/admin/project',
      query: {
        id: props.id,
        content: 'video',
        action: 'edit'
      }
    };

    editBtns.forEach( btn => {
      btn.simulate( 'click' );
      expect( Router.push ).toHaveBeenCalledWith( path, prettyPath );
    } );
  } );

  it( 'displays the Delete button if status is DRAFT', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );

    expect( deleteBtn.exists() ).toEqual( true );
  } );

  it( 'displays the Publish button in the header if status is DRAFT', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const header = videoReview.find( 'ProjectHeader' );
    const publishBtn = header.find( 'Button.project_button--publish' );

    expect( publishBtn.length ).toEqual( 1 );
    expect( publishBtn.exists() ).toEqual( true );
    expect( publishBtn.text() ).toEqual( 'Publish' );
  } );

  it( 'does not display the Publish and Delete button in the header if status is not DRAFT', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ publishedMocks } addTypename>
        <VideoReview { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );
    const header = videoReview.find( 'ProjectHeader' );
    const publishBtns = header.find( 'Button.project_button--publish' );
    const btnTxt = ['Update', 'UnPublish'];

    expect( deleteBtn.exists() ).toEqual( false );
    publishBtns.forEach( ( btn, i ) => {
      expect( btn.exists() ).toEqual( true );
      expect( btn.text() ).toEqual( btnTxt[i] );
      expect( btn.text() ).not.toEqual( 'Publish' );
    } );
  } );

  it( 'clicking the Unpublish button calls unPublishProject and redirects to dashboard', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ publishedMocks } addTypename>
        <VideoReview { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const header = videoReview.find( 'ProjectHeader' );
    const publishBtns = header.find( 'Button.project_button--publish' );
    const unpublishBtn = publishBtns.filterWhere( btn => btn.text() === 'UnPublish' );
    const { id } = props;
    const spy = jest.spyOn( videoReview.props(), 'unPublishProject' );
    Router.push = jest.fn();

    unpublishBtn.simulate( 'click' );
    Promise.resolve()
      .then( () => {
        expect( spy ).toHaveBeenCalledWith( { variables: { id } } );
        expect( Router.push ).toHaveBeenCalledWith( {
          pathname: `/admin/dashboard`
        } );
      } ).catch( () => {} );
  } );

  it( 'clicking a Publish button calls publishProject and redirects to the dashboard', async () => {
    /**
     * @todo Test passes but would like to revisit.
     * Not convinced this is the best approach.
     */
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const publishBtns = videoReview.find( 'Button.project_button--publish' );
    const { id } = props;
    const spy = jest.spyOn( videoReview.props(), 'publishProject' );
    Router.push = jest.fn();

    /**
     * one button in header (since status is DRAFT)
     * and one at bottom of page
     */
    expect( publishBtns.length ).toEqual( 2 );
    publishBtns.forEach( btn => {
      btn.simulate( 'click' );
      Promise.resolve()
        .then( () => {
          expect( spy ).toHaveBeenCalledWith( { variables: { id } } );
          expect( Router.push ).toHaveBeenCalledWith( {
            pathname: `/admin/dashboard`
          } );
        } ).catch( () => {} );
    } );
  } );

  it( 'clicking the Delete button opens the Confirm modal', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );
    const confirmModal = () => wrapper.find( 'Confirm' );

    // closed initially
    expect( confirmModal().prop( 'open' ) ).toEqual( false );

    // open the modal
    deleteBtn.simulate( 'click' );
    expect( confirmModal().prop( 'open' ) ).toEqual( true );
  } );

  it( 'clicking Cancel in <Confirm /> closes the modal', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );
    const confirmModal = () => wrapper.find( 'Confirm' );
    const cancelBtn = () => wrapper.find( '[content="No, take me back"]' );

    // closed initially
    expect( confirmModal().prop( 'open' ) ).toEqual( false );

    // open the modal
    deleteBtn.simulate( 'click' );
    expect( confirmModal().prop( 'open' ) ).toEqual( true );

    // close the modal
    cancelBtn().simulate( 'click' );
    expect( confirmModal().prop( 'open' ) ).toEqual( false );
  } );

  it( 'clicking Confirm in <Confirm /> calls deleteProject and redirects to the dashboard', async () => {
    /**
     * @todo Test passes but would like to revisit.
     * Not convinced this is the best approach.
     */
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );
    const confirmModal = () => wrapper.find( 'Confirm' );
    const confirmBtn = () => wrapper.find( '[content="Yes, delete forever"]' );
    const { id } = props;
    const spy = jest.spyOn( videoReview.props(), 'deleteProject' );
    Router.push = jest.fn();

    // closed initially
    expect( confirmModal().prop( 'open' ) ).toEqual( false );

    // open the modal
    deleteBtn.simulate( 'click' );
    expect( confirmModal().prop( 'open' ) ).toEqual( true );

    // confirm project deletion
    confirmBtn().simulate( 'click' );
    Promise.resolve()
      .then( () => {
        expect( spy ).toHaveBeenCalledWith( { variables: { id } } );
      } ).catch( () => {} );
    expect( Router.push ).toHaveBeenCalledWith( {
      pathname: '/admin/dashboard'
    } );
  } );

  it( 'does not redirect to dashboard if publishing error', async () => {
    /**
     * @todo Would like to test `setPublishError`
     * in `handlePublish` `catch` block
     */
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const publishBtns = videoReview.find( 'Button.project_button--publish' );
    const { id } = props;
    const err = new Error( `Error unpublishing project ${id}` );
    const spy = jest.spyOn( videoReview.props(), 'publishProject' );
    Router.push = jest.fn();

    publishBtns.forEach( btn => {
      btn.simulate( 'click' );
      Promise.reject( err )
        .then( () => {} )
        .catch( err => {
          expect( spy ).not.toHaveBeenCalled();
          expect( Router.push ).not.toHaveBeenCalled();
        } );
    } );
  } );

  it( 'does not redirect to dashboard if unpublishing error', async () => {
    /**
     * @todo Would like to test `setPublishError`
     * in `handleUnPublish` `catch` block
     */
    const wrapper = mount(
      <MockedProvider mocks={ publishedMocks } addTypename>
        <VideoReview { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const publishBtns = videoReview.find( 'Button.project_button--publish' );
    const unpublishBtn = publishBtns.filterWhere( btn => btn.text() === 'UnPublish' );
    const { id } = props;
    const err = new Error( `Error unpublishing project ${id}` );
    const spy = jest.spyOn( videoReview.props(), 'unPublishProject' );
    Router.push = jest.fn();

    unpublishBtn.simulate( 'click' );
    Promise.reject( err )
      .then( () => {} )
      .catch( err => {
        expect( spy ).not.toHaveBeenCalled();
        expect( Router.push ).not.toHaveBeenCalled();
      } );
  } );
} );
