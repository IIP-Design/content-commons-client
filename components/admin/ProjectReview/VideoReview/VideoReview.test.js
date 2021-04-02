import { mount, shallow } from 'enzyme';
import Link from 'next/link';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from '@apollo/client/testing';
import { Icon, Loader } from 'semantic-ui-react';

import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';
import VideoReviewUnitTest from './VideoReview';

import { suppressActWarning } from 'lib/utils';
import {
  draftMocks,
  errorMocks,
  mocks,
  noUpdatesToPublishMocks,
  nullMocks,
  props,
  publishErrorMocks,
  unpublishErrorMocks,
} from './mocks';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
  },
} ) );

jest.mock(
  'components/admin/ProjectUnits/ProjectUnitItem/ProjectUnitItem',
  () => function ProjectUnitItem() { return ''; },
);
jest.mock(
  'components/admin/ProjectReview/VideoProjectData/VideoProjectData',
  () => function VideoProjectData() { return ''; },
);
jest.mock(
  'components/admin/ProjectReview/VideoSupportFiles/VideoSupportFiles',
  () => function VideoSupportFiles() { return ''; },
);
jest.mock(
  'components/admin/ProjectReview/VideoProjectFiles/VideoProjectFiles',
  () => function VideoProjectFiles() { return ''; },
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
    <VideoReviewUnitTest { ...props } />
  </MockedProvider>
);

// project status change to DRAFT from PUBLISHED
const DraftComponent = (
  <MockedProvider mocks={ draftMocks } addTypename>
    <VideoReviewUnitTest { ...props } />
  </MockedProvider>
);

describe( '<VideoReview />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  const getBtn = ( buttons, str ) => buttons.filterWhere( btn => btn.text() === str );
  const publishingButtons = [
    'Delete Project', 'Edit', 'Preview Project', 'Publish Changes', 'Publish', 'Unpublish',
  ];

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
        <VideoReviewUnitTest { ...props } />
      </MockedProvider>,
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

  // notPublished = data.project.status !== 'PUBLISHED';
  it.skip( 'renders the correct bottom CTA headline and buttons if status is DRAFT', async () => {
    const wrapper = mount( DraftComponent );

    await wait( 0 );
    wrapper.update();

    const VideoReview = wrapper.find( 'VideoReview' );

    // Buttons
    const btns = VideoReview.find( 'Button' );

    publishingButtons.forEach( txt => {
      switch ( txt ) {
        case 'Delete Project':
          expect( getBtn( btns, txt ).exists() ).toEqual( true );
          break;
        case 'Edit':
          expect( getBtn( btns, txt ).length ).toEqual( 2 );
          break;
        case 'Preview Project':
          expect( getBtn( btns, txt ).exists() ).toEqual( true );
          break;
        case 'Publish Changes':
          expect( getBtn( btns, txt ).exists() ).toEqual( false );
          break;
        case 'Publish':
          expect( getBtn( btns, txt ).length ).toEqual( 2 );
          break;
        case 'Unpublish':
          expect( getBtn( btns, txt ).exists() ).toEqual( false );
          break;
        default:
          break;
      }
    } );

    // Bottom Headline
    const ctaHeadline = VideoReview.find( '.section--publish > h3.title' );
    const headingTxt = 'Your project looks great! Are you ready to Publish?';

    expect( ctaHeadline.text() ).toEqual( headingTxt );
  } );

  // publishedAndUpdated = projectUpdate[id] && data.project.status === 'PUBLISHED';
  it.skip( 'renders the correct bottom CTA headline and buttons if there are updates to publish', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const VideoReview = wrapper.find( 'VideoReview' );
    const btns = VideoReview.find( 'Button' );

    publishingButtons.forEach( txt => {
      switch ( txt ) {
        case 'Delete Project':
          expect( getBtn( btns, txt ).exists() ).toEqual( false );
          break;
        case 'Edit':
          expect( getBtn( btns, txt ).length ).toEqual( 2 );
          break;
        case 'Preview Project':
          expect( getBtn( btns, txt ).exists() ).toEqual( true );
          break;
        case 'Publish Changes':
          expect( getBtn( btns, txt ).length ).toEqual( 2 );
          break;
        case 'Publish':
          expect( getBtn( btns, txt ).exists() ).toEqual( false );
          break;
        case 'Unpublish':
          expect( getBtn( btns, txt ).length ).toEqual( 2 );
          break;
        default:
          break;
      }
    } );

    // Bottom CTA Headline
    const ctaHeadline = VideoReview.find( '.section--publish > h3.title' );
    const headingTxt = 'It looks like you made changes to your project. Do you want to publish changes?';

    expect( ctaHeadline.text() ).toEqual( headingTxt );
  } );

  // publishedAndNotUpdated = !projectUpdate[id] && data.project.status === 'PUBLISHED';
  it.skip( 'renders the correct bottom CTA headline and buttons if there are no updates to publish', async () => {
    const propsNoUpdate = {
      ...props,
      projectUpdate: {},
    };

    const wrapper = mount(
      <MockedProvider mocks={ noUpdatesToPublishMocks } addTypename>
        <VideoReviewUnitTest { ...propsNoUpdate } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );

    const { project } = videoReview.prop( 'data' );

    expect( project.status ).toEqual( 'PUBLISHED' );

    const btns = wrapper.find( 'Button' );

    publishingButtons.forEach( txt => {
      switch ( txt ) {
        case 'Delete Project':
          expect( getBtn( btns, txt ).exists() ).toEqual( false );
          break;
        case 'Edit':
          expect( getBtn( btns, txt ).length ).toEqual( 2 );
          break;
        case 'Preview Project':
          expect( getBtn( btns, txt ).exists() ).toEqual( true );
          break;
        case 'Publish Changes':
          expect( getBtn( btns, txt ).exists() ).toEqual( false );
          break;
        case 'Publish':
          expect( getBtn( btns, txt ).exists() ).toEqual( false );
          break;
        case 'Unpublish':
          expect( getBtn( btns, txt ).length ).toEqual( 2 );
          break;
        default:
          break;
      }
    } );

    const CTAheadline = videoReview.find( 'h3.title' );
    const headingTxt = 'Not ready to share with the world yet?';

    expect( CTAheadline.text() ).toEqual( headingTxt );
  } );

  it.skip( 'renders ApolloError with a default `null` error prop value', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const apolloError = wrapper.find( 'ApolloError' );

    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.prop( 'error' ) ).toEqual( null );
  } );

  it.skip( 'redirects to <ProjectNotFound /> if project is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename>
        <VideoReviewUnitTest { ...props } />
      </MockedProvider>,
    );

    const pageNotFound = shallow( <ProjectNotFound /> );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const notFoundMsg = <p>The project you’re looking for doesn’t exist.</p>;
    const dashboardLink
      = (
        <p>
          Go to my
          <Link href="/admin/dashboard"><a>project dashboard</a></Link>
          .
        </p>
      );

    expect( videoReview.exists() ).toEqual( true );
    expect( pageNotFound.exists() ).toEqual( true );
    expect( pageNotFound.contains( notFoundMsg ) ).toEqual( true );
    expect( pageNotFound.contains( dashboardLink ) ).toEqual( true );
  } );

  it.skip( 'renders the Delete button if status is DRAFT', async () => {
    const wrapper = mount( DraftComponent );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );
    const { project } = videoReview.prop( 'data' );

    expect( project.status ).toEqual( 'DRAFT' );
    expect( deleteBtn.exists() ).toEqual( true );
  } );

  it.skip( 'renders the correct headline if status is DRAFT', async () => {
    const wrapper = mount( DraftComponent );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const headline = videoReview.find( 'h3.title' );
    const headingTxt = 'Your project looks great! Are you ready to Publish?';
    const { project } = videoReview.prop( 'data' );

    expect( project.status ).toEqual( 'DRAFT' );
    expect( headline.text() ).toEqual( headingTxt );
  } );

  it.skip( 'renders the Publish button in the header if status is DRAFT', async () => {
    const wrapper = mount( DraftComponent );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const header = videoReview.find( 'ProjectHeader' );
    const publishBtn = header.find( 'Button.project_button--publish' );
    const { project } = videoReview.prop( 'data' );

    expect( project.status ).toEqual( 'DRAFT' );
    expect( publishBtn.exists() ).toEqual( true );
    expect( publishBtn.text() ).toEqual( 'Publish' );
  } );

  it.skip( 'renders an Unpublish button and does not render the Publish and Delete button in the header if status is not DRAFT', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const deleteBtn = videoReview.find( 'Button.project_button--delete' );
    const header = videoReview.find( 'ProjectHeader' );
    const unPublishBtn = header.find( 'Button.project_button--publish' );
    const { project } = videoReview.prop( 'data' );

    expect( project.status ).toEqual( 'PUBLISHED' );
    expect( deleteBtn.exists() ).toEqual( false );
    expect( unPublishBtn.exists() ).toEqual( true );
    expect( unPublishBtn.text() ).toEqual( 'Unpublish' );
  } );

  it.skip( 'clicking an Edit button redirects to <VideoEdit />', async () => {
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
        action: 'edit',
      },
    };

    editBtns.forEach( btn => {
      btn.simulate( 'click' );
      expect( Router.push ).toHaveBeenCalledWith( path, prettyPath );
    } );
  } );

  it.skip( 'clicking the Unpublish button calls unPublishProject and redirects to dashboard', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const header = videoReview.find( 'ProjectHeader' );
    const publishBtns = header.find( 'Button.project_button--publish' );
    const unpublishBtn = publishBtns.filterWhere( btn => btn.text() === 'Unpublish' );
    const { id } = props;
    const unPublishProject = jest.spyOn( videoReview.props(), 'unPublishProject' )
      .mockResolvedValue( {
        data: {
          unpublishVideoProject: {
            __typename: 'VideoProject',
            id,
          },
        },
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

  it.skip( 'clicking a Publish button calls publishProject and redirects to the dashboard', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const btns = videoReview.find( 'Button' );
    const publishBtns = btns.filterWhere(
      btn => btn.text() === 'Publish Changes',
    );
    const { id } = props;

    Router.push = jest.fn( () => ( { pathname: '/admin/dashboard' } ) );
    const publishProject = jest.spyOn( videoReview.props(), 'publishProject' )
      .mockResolvedValue( {
        data: {
          publishVideoProject: {
            __typename: 'VideoProject',
            id,
            status: 'PUBLISHED',
          },
        },
      } );

    publishBtns.forEach( btn => {
      btn.simulate( 'click' );
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
  } );

  it.skip( 'clicking the Delete button opens the Confirm modal', async () => {
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

  it.skip( 'clicking Cancel in <Confirm /> closes the modal', async () => {
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

  it.skip( 'clicking Confirm in <Confirm /> calls deleteProject and redirects to the dashboard', async () => {
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
            id,
          },
        },
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

  it.skip( 'if publishing error, returns ApolloError and does not redirect to dashboard', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ publishErrorMocks } addTypename>
        <VideoReviewUnitTest { ...props } />
      </MockedProvider>,
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
            graphQLErrors: [
              {
                message: 'There was a publishing error.',
              },
            ],
          },
        ],
      } );

    publishBtns.forEach( btn => {
      btn.simulate( 'click' );
      publishProject()
        .then( () => {} )
        .catch( () => {
          expect( apolloError().prop( 'error' ) ).toEqual( {
            otherError: 'There was a publishing error.',
          } );
          expect( publishProject )
            .not.toHaveBeenCalledWith( { variables: { id } } );
          expect( Router.push ).not.toHaveBeenCalled();
        } );
    } );
  } );

  it.skip( 'if unpublishing error, returns ApolloError and does not redirect to dashboard', async done => {
    const wrapper = mount(
      <MockedProvider mocks={ unpublishErrorMocks } addTypename>
        <VideoReviewUnitTest { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const apolloError = () => wrapper.find( 'ApolloError' );
    const btns = videoReview.find( 'Button.project_button--publish' );
    const unpublishBtns = btns.filterWhere( btn => btn.text() === 'Unpublish' );
    const { id } = props;

    Router.push = jest.fn();
    const unPublishProject = jest.spyOn( videoReview.props(), 'unPublishProject' )
      .mockRejectedValue( {
        errors: [
          {
            graphQLErrors: [
              {
                message: 'There was an unpublishing error.',
              },
            ],
          },
        ],
      } );

    expect( unpublishBtns.exists() ).toEqual( true );
    unpublishBtns.forEach( btn => {
      btn.simulate( 'click' );
      unPublishProject()
        .then( () => {} )
        .catch( () => {
          expect( apolloError().prop( 'error' ) ).toEqual( {
            otherError: 'There was an unpublishing error.',
          } );
          expect( unPublishProject )
            .not.toHaveBeenCalledWith( { variables: { id } } );
          expect( Router.push ).not.toHaveBeenCalled();
        } );
      done();
    } );
  } );
} );
