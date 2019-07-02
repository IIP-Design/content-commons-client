import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import { Loader } from 'semantic-ui-react';
import { VIDEO_PROJECT_PREVIEW_QUERY } from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
import { getMocks } from 'components/admin/projects/ProjectEdit/PreviewProjectContent/mocks';
import VideoProjectFiles from './VideoProjectFiles';

jest.mock( 'next-server/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET: 's3-bucket-url' } } ) );

jest.mock( 'lib/utils', () => ( {
  getPluralStringOrNot: jest.fn( ( array, string ) => (
    `${string}${array && array.length > 1 ? 's' : ''}`
  ) )
} ) );

jest.mock( './VideoProjectFile/VideoProjectFile', () => () => '<VideoProjectFile />' );

const props = { id: '123' };

const mocks = getMocks( VIDEO_PROJECT_PREVIEW_QUERY, props );

const nullMocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: { project: null }
    }
  }
];

const noUnitsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: []
        }
      }
    }
  }
];

const nullUnitsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: null
        }
      }
    }
  }
];

const nullFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: null
            }
          ]
        }
      }
    }
  }
];

const emptyFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: []
            }
          ]
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <VideoProjectFiles { ...props } />
  </MockedProvider>
);

describe( '<VideoProjectFiles />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading project file(s)..."
      />
    );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.contains( loader ) ).toEqual( true );
  } );

  it( 'renders error message if an error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_QUERY,
          variables: { id: props.id }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const errorComponent = videoProjectFiles.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders `null` if project is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'renders the final state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( toJSON( videoProjectFiles ) ).toMatchSnapshot();
  } );

  it( 'clicking the Edit button redirects to <VideoEdit />', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const header = videoProjectFiles.find( '.project_file_header' );
    const editBtns = header.find( 'Button.project_button--edit' );
    Router.push = jest.fn();

    editBtns.forEach( btn => {
      const { id } = props;
      btn.simulate( 'click' );
      expect( Router.push ).toHaveBeenCalledWith( {
        pathname: '/admin/project',
        query: {
          id,
          content: 'video',
          action: 'edit'
        }
      }, `/admin/project/video/${id}/edit` );
    } );
  } );

  it( 'renders `null` if units is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullUnitsMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'renders `null` if units is `[]`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noUnitsMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFiles.html() ).toEqual( null );
  } );

  it( 'does not render VideoProjectFile if unit.files is `null`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullFilesMocks } addTypename>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const videoProjectFile = videoProjectFiles.find( 'VideoProjectFile' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFile.exists() ).toEqual( false );
  } );

  it( 'does not render VideoProjectFile if unit.files is `[]`', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ emptyFilesMocks }>
        <VideoProjectFiles { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const videoProjectFiles = wrapper.find( 'VideoProjectFiles' );
    const videoProjectFile = videoProjectFiles.find( 'VideoProjectFile' );

    expect( videoProjectFiles.exists() ).toEqual( true );
    expect( videoProjectFile.exists() ).toEqual( false );
  } );
} );
