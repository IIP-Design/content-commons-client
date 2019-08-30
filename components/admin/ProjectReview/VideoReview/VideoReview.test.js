import { mount, shallow } from 'enzyme';
import Link from 'next/link';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';
import VideoReview from './VideoReview';
import {
  draftMocks,
  errorMocks,
  mocks,
  noUpdatesToPublishMocks,
  nullMocks,
  props,
  publishErrorMocks,
  unpublishErrorMocks
} from './mocks';

jest.mock(
  'next-server/config',
  () => ( {
    publicRuntimeConfig: {
      REACT_APP_AWS_S3_PUBLISHER_BUCKET: 's3-bucket-url'
    }
  } )
);

jest.mock(
  'components/admin/projects/ProjectEdit/ProjectUnitItem/ProjectUnitItem',
  () => function ProjectUnitItem() {
    return <div>ProjectUnitItem</div>;
  }
);

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

/**
 * Addresses `Error: No router instance found. You should only use "next/router" inside the client side of your app.`
 * @see https://github.com/zeit/next.js/issues/1827
 */
const mockedRouter = { push: jest.fn() };
Router.router = mockedRouter;

// project status change to PUBLISHED from DRAFT
const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <VideoReview { ...props } />
  </MockedProvider>
);

// project status change to DRAFT from PUBLISHED
const DraftComponent = (
  <MockedProvider mocks={ draftMocks } addTypename>
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
    const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';
    jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
      if ( !args[0].includes( actMsg ) ) {
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

  it( 'renders ApolloError with a default `null` error prop value', async () => {
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

  it( 'renders the Delete button if status is DRAFT', async () => {
    const wrapper = mount( DraftComponent );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );

    expect( deleteBtn.exists() ).toEqual( true );
  } );

  it( 'renders the Publish button in the header if status is DRAFT', async () => {
    const wrapper = mount( DraftComponent );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const header = videoReview.find( 'ProjectHeader' );
    const publishBtn = header.find( 'Button.project_button--publish' );

    expect( publishBtn.exists() ).toEqual( true );
    expect( publishBtn.text() ).toEqual( 'Publish' );
  } );

  it( 'renders an UnPublish button and does not render the Publish and Delete button in the header if status is not DRAFT', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );
    const header = videoReview.find( 'ProjectHeader' );
    const unPublishBtn = header.find( 'Button.project_button--publish' );

    expect( deleteBtn.exists() ).toEqual( false );
    expect( unPublishBtn.exists() ).toEqual( true );
    expect( unPublishBtn.text() ).toEqual( 'UnPublish' );
  } );

  it( 'renders the correct headline and buttons if there are updates to publish', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const headline = videoReview.find( 'h3.title' );
    const publishBtns = videoReview.find( 'Button.project_button--publish' );
    const editBtns = videoReview.find( 'Button.project_button--edit' );
    const publishChangesTxt = 'Publish Changes';
    const publishChangesBtn = publishBtns.filterWhere( btn => btn.text() === publishChangesTxt );
    const publishBtnTxt = ['UnPublish', publishChangesTxt];
    const editBtnTxt = ['Edit', publishChangesTxt, 'Edit'];
    const headingTxt = 'It looks like you made changes to your project. Do you want to publish changes?';

    expect( headline.text() ).toEqual( headingTxt );
    expect( publishChangesBtn.exists() ).toEqual( true );
    expect( publishChangesBtn.text() ).toEqual( publishChangesTxt );
    expect( editBtns.length ).toEqual( 3 );
    editBtns.forEach( ( btn, i ) => {
      expect( btn.text() ).toEqual( editBtnTxt[i] );
    } );
    publishBtns.forEach( ( btn, i ) => {
      expect( btn.text() ).toEqual( publishBtnTxt[i] );
    } );
  } );

  it( 'renders the correct headline and buttons if there are no updates to publish', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noUpdatesToPublishMocks } addTypename>
        <VideoReview { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const headline = videoReview.find( 'h3.title' );
    const publishBtns = videoReview.find( 'Button.project_button--publish' );
    const editBtns = videoReview.find( 'Button.project_button--edit' );
    const publishChangesBtn = publishBtns.filterWhere( btn => btn.text() === 'Publish Changes' );
    const btnTxt = ['UnPublish', 'Publish'];
    const headingTxt = 'Your project looks great! Are you ready to Publish?';

    expect( headline.text() ).toEqual( headingTxt );
    expect( publishChangesBtn.exists() ).toEqual( false );
    expect( editBtns.length ).toEqual( 2 ); // one at top & bottom of page
    editBtns.forEach( btn => {
      expect( btn.text() ).toEqual( 'Edit' );
      expect( btn.text() ).not.toEqual( 'Publish Changes' );
    } );
    publishBtns.forEach( ( btn, i ) => {
      expect( btn.text() ).toEqual( btnTxt[i] );
    } );
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

  it( 'clicking the UnPublish button calls unPublishProject and redirects to dashboard', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const header = videoReview.find( 'ProjectHeader' );
    const publishBtns = header.find( 'Button.project_button--publish' );
    const unpublishBtn = publishBtns.filterWhere( btn => btn.text() === 'UnPublish' );
    const { id } = props;
    const unPublishProject = jest.spyOn( videoReview.props(), 'unPublishProject' )
      .mockResolvedValue( {
        data: {
          unpublishVideoProject: {
            __typename: 'VideoProject',
            id
          }
        }
      } );

    unpublishBtn.simulate( 'click' );
    unPublishProject()
      .then( data => {
        expect( data.unpublishVideoProject.id ).toEqual( id );
        expect( unPublishProject )
          .toHaveBeenCalledWith( { variables: { id } } );
        expect( Router.push ).toHaveBeenCalled();
      } )
      .catch( () => {} );
  } );

  it( 'clicking a Publish button calls publishProject and redirects to the dashboard', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const btns = videoReview.find( 'Button.project_button--publish' );
    const publishBtn = btns.filterWhere(
      btn => btn.text() === 'Publish Changes'
    );
    const { id } = props;
    Router.push = jest.fn( () => ( { pathname: `/admin/dashboard` } ) );
    const publishProject = jest.spyOn( videoReview.props(), 'publishProject' )
      .mockResolvedValue( {
        data: {
          publishVideoProject: {
            __typename: 'VideoProject',
            id,
            status: 'PUBLISHED'
          }
        }
      } );

    publishBtn.simulate( 'click' );
    publishProject()
      .then( data => {
        expect( data.publishVideoProject.id ).toEqual( id );
        expect( data.publishVideoProject.status ).toEqual( 'PUBLISHED' );
        expect( publishProject )
          .toHaveBeenCalledWith( { variables: { id } } );
        expect( Router.push ).toHaveBeenCalled();
      } )
      .catch( () => {} );
  } );

  it( 'clicking the Delete button opens the Confirm modal', async () => {
    const wrapper = mount( DraftComponent );
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
    const wrapper = mount( DraftComponent );
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
    const wrapper = mount( DraftComponent );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );
    const confirmModal = () => wrapper.find( 'Confirm' );
    const confirmBtn = () => wrapper.find( '[content="Yes, delete forever"]' );
    const { id } = props;
    const deleteProject = jest.spyOn( videoReview.props(), 'deleteProject' )
      .mockResolvedValue( {
        data: {
          deleteVideoProject: {
            __typename: 'VideoProject',
            id
          }
        }
      } );

    // closed initially
    expect( confirmModal().prop( 'open' ) ).toEqual( false );

    // open the modal
    deleteBtn.simulate( 'click' );
    expect( confirmModal().prop( 'open' ) ).toEqual( true );

    // confirm project deletion
    confirmBtn().simulate( 'click' );
    deleteProject()
      .then( data => {
        expect( data.deleteVideoProject.id ).toEqual( id );
        expect( deleteProject ).toHaveBeenCalledWith( { variables: { id } } );
        expect( Router.push )
          .toHaveBeenCalledWith( { pathname: '/admin/dashboard' } );
      } )
      .catch( () => {} );
  } );

  it( 'if publishing error, returns ApolloError and does not redirect to dashboard', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ publishErrorMocks } addTypename>
        <VideoReview { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const publishBtns = videoReview.find( 'Button.project_button--publish' );
    const apolloError = () => wrapper.find( 'ApolloError' );
    const { id } = props;
    Router.push = jest.fn();
    const publishProject = jest.spyOn( videoReview.props(), 'publishProject' )
      .mockRejectedValue( {
        errors: [
          {
            graphQLErrors: [{
              message: 'There was a publishing error.'
            }]
          }
        ]
      } );

    publishBtns.forEach( btn => {
      btn.simulate( 'click' );
      publishProject()
        .then( () => {} )
        .catch( () => {
          expect( apolloError().prop( 'error' ) ).toEqual( {
            otherError: 'There was a publishing error.'
          } );
          expect( publishProject )
            .not.toHaveBeenCalledWith( { variables: { id } } );
          expect( Router.push ).not.toHaveBeenCalled();
        } );
    } );
  } );

  it( 'if unpublishing error, returns ApolloError and does not redirect to dashboard', async done => {
    const wrapper = mount(
      <MockedProvider mocks={ unpublishErrorMocks } addTypename>
        <VideoReview { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const apolloError = () => wrapper.find( 'ApolloError' );
    const btns = videoReview.find( 'Button.project_button--publish' );
    const unpublishBtn = btns.filterWhere( btn => btn.text() === 'UnPublish' );
    const { id } = props;
    Router.push = jest.fn();
    const unPublishProject = jest.spyOn( videoReview.props(), 'unPublishProject' )
      .mockRejectedValue( {
        errors: [
          {
            graphQLErrors: [{
              message: 'There was an unpublishing error.'
            }]
          }
        ]
      } );

    expect( unpublishBtn.exists() ).toEqual( true );
    unpublishBtn.simulate( 'click' );
    unPublishProject()
      .then( () => {} )
      .catch( () => {
        expect( apolloError().prop( 'error' ) ).toEqual( {
          otherError: 'There was an unpublishing error.'
        } );
        expect( unPublishProject )
          .not.toHaveBeenCalledWith( { variables: { id } } );
        expect( Router.push ).not.toHaveBeenCalled();
      } );
    done();
  } );
} );
