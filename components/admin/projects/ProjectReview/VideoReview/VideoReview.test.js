import { mount, shallow } from 'enzyme';
import Link from 'next/link';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import ProjectNotFound from 'components/admin/ProjectNotFound/ProjectNotFound';
import { DELETE_VIDEO_PROJECT_MUTATION } from 'components/admin/projects/ProjectEdit/VideoEdit/VideoEdit';
import VideoReview, { VIDEO_REVIEW_PROJECT_QUERY } from './VideoReview';

jest.mock(
  'components/admin/projects/ProjectReview/VideoProjectData/VideoProjectData',
  /* eslint-disable react/display-name */
  () => () => <div>VideoProjectData</div>
);

jest.mock(
  'components/admin/projects/ProjectReview/VideoSupportFiles/VideoSupportFiles',
  /* eslint-disable react/display-name */
  () => () => <div>VideoSupportFiles</div>
);

jest.mock(
  'components/admin/projects/ProjectReview/VideoProjectFiles/VideoProjectFiles',
  /* eslint-disable react/display-name */
  () => () => <div>VideoProjectFiles</div>
);

const props = { id: '234' };

const mocks = [
  {
    request: {
      query: VIDEO_REVIEW_PROJECT_QUERY,
      variables: { id: props.id }
    },
    result: { data: { project: { id: props.id } } }
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
    <VideoReview { ...props } />
  </MockedProvider>
);

describe( '<VideoReview />', () => {
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
    const errorMocks = [
      {
        request: {
          query: VIDEO_REVIEW_PROJECT_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks }>
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

  it( 'redirects to <ProjectNotFound /> if project is `null`', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_REVIEW_PROJECT_QUERY,
          variables: { id: props.id }
        },
        result: { data: { project: null } }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks }>
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

    editBtns.forEach( btn => {
      btn.simulate( 'click' );
      expect( Router.push ).toHaveBeenCalledWith( {
        pathname: `/admin/project/video/${props.id}/edit`
      } );
    } );
  } );

  it( 'clicking a Publish button redirects to the dashboard', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoReview = wrapper.find( 'VideoReview' );
    const publishBtns = videoReview.find( 'Button.project_button--publish' );
    Router.push = jest.fn();

    publishBtns.forEach( btn => {
      btn.simulate( 'click' );
      expect( Router.push ).toHaveBeenCalledWith( {
        pathname: `/admin/dashboard`
      } );
    } );
  } );

  /**
   * @todo Need to revisit this test when
   * enzyme supports hooks. Why is spy not called?
   */
  it( 'clicking Confirm in <Confirm /> redirects to the dashboard after deleting project', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    // const videoReview = wrapper.find( 'VideoReview' );
    const confirmModal = wrapper.find( 'Confirm' );
    // const spy = jest.spyOn( videoReview.props(), 'deleteProject' );
    Router.push = jest.fn();

    confirmModal.prop( 'onConfirm' )();

    // expect( spy ).toHaveBeenCalled();
    expect( Router.push ).toHaveBeenCalledWith( {
      pathname: '/admin/dashboard'
    } );
  } );
} );
