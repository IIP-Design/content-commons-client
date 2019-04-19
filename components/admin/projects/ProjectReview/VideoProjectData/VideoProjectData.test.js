import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import VideoProjectData, { VIDEO_PROJECT_REVIEW_DATA_QUERY } from './VideoProjectData';

const props = { id: '123' };

const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_REVIEW_DATA_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          id: '123',
          projectTitle: 'test title',
          author: {
            id: 'au438',
            firstName: 'Jane',
            lastName: 'Doe'
          },
          team: {
            name: 'IIP Video Production'
          },
          visibility: 'PUBLIC',
          descPublic: 'The public description',
          descInternal: 'The internal description',
          categories: [
            {
              translations: {
                name: 'about america'
              }
            },
            {
              translations: {
                name: 'Amérique'
              }
            }
          ],
          tags: [
            {
              translations: {
                name: 'american culture'
              }
            },
            {
              translations: {
                name: 'Culture américaine'
              }
            }
          ]
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <VideoProjectData { ...props } />
  </MockedProvider>
);

describe( '<VideoProjectData />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoProjectData = wrapper.find( 'VideoProjectData' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading project data..."
      />
    );

    expect( videoProjectData.exists() ).toEqual( true );
    expect( videoProjectData.contains( loader ) ).toEqual( true );
    expect( toJSON( videoProjectData ) ).toMatchSnapshot();
  } );

  it( 'renders error message & icon if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_DATA_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks }>
        <VideoProjectData { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );
    const div = videoProjectData
      .find( 'div.video-project-data.error' );
    const icon = <Icon color="red" name="exclamation triangle" />;
    const span = <span>Loading error...</span>;

    expect( div.exists() ).toEqual( true );
    expect( videoProjectData.contains( icon ) )
      .toEqual( true );
    expect( videoProjectData.contains( span ) )
      .toEqual( true );
  } );

  it( 'renders `null` if project is `null`', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_PROJECT_REVIEW_DATA_QUERY,
          variables: { id: props.id }
        },
        result: {
          data: { project: null }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks }>
        <VideoProjectData { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );

    expect( videoProjectData.html() ).toEqual( null );
  } );

  it( 'renders the final state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoProjectData = wrapper.find( 'VideoProjectData' );

    expect( toJSON( videoProjectData ) ).toMatchSnapshot();
  } );
} );
