import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Icon, Loader } from 'semantic-ui-react';
import ProjectItemsList, { PROJECT_ITEMS_QUERY } from './ProjectItemsList';

const Trigger = () => <div className="trigger">Trigger</div>;
const Content = () => <div className="content">Content</div>;

const props = {
  listEl: 'ul',
  projectId: '123',
  headline: 'Videos in Project',
  hasSubmittedData: true,
  projectType: 'video',
  displayItemInModal: true,
  modalTrigger: Trigger,
  modalContent: Content
};

const mocks = [
  {
    request: {
      query: PROJECT_ITEMS_QUERY,
      variables: { id: props.projectId }
    },
    result: {
      data: {
        project: {
          units: [
            {
              id: 'edf123',
              title: 'Test Title YYY',
              language: {
                displayName: 'English'
              }
            },
            {
              id: 'mno456',
              title: 'Test Title ZZZ',
              language: {
                displayName: 'French'
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
    <ProjectItemsList { ...props } />
  </MockedProvider>
);

describe( '<ProjectItemsList />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const projectItemsList = wrapper.find( 'ProjectItemsList' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
        content="Loading the project items..."
      />
    );

    expect( projectItemsList.exists() ).toEqual( true );
    expect( projectItemsList.contains( loader ) ).toEqual( true );
    expect( toJSON( projectItemsList ) ).toMatchSnapshot();
  } );

  it( 'renders error message if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: PROJECT_ITEMS_QUERY,
          variables: { id: props.projectId }
        },
        result: {
          errors: [{ message: 'There was an error.' }],
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <ProjectItemsList { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const projectItemsList = wrapper.find( 'ProjectItemsList' );
    const div = projectItemsList.find( 'div.project-items-list.error' );
    const icon = <Icon color="red" name="exclamation triangle" />;
    const span = <span>Loading error</span>;

    expect( projectItemsList.exists() ).toEqual( true );
    expect( div.exists() ).toEqual( true );
    expect( projectItemsList.contains( icon ) ).toEqual( true );
    expect( projectItemsList.contains( span ) ).toEqual( true );
  } );

  it( 'renders null if `project` is null', async () => {
    const nullMocks = [
      {
        request: {
          query: PROJECT_ITEMS_QUERY,
          variables: { id: props.projectId }
        },
        result: {
          data: { project: null },
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <ProjectItemsList { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const projectItemsList = wrapper.find( 'ProjectItemsList' );

    expect( projectItemsList.html() ).toEqual( null );
  } );

  it( 'renders the correct number of ProjectItem components', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const projectItemsList = wrapper.find( 'ProjectItemsList' );
    const projectItems = projectItemsList.find( 'ProjectItem' );
    const { units } = projectItemsList.prop( 'data' ).project;

    expect( projectItems ).toHaveLength( units.length );
  } );

  it( 'renders a custom element', async () => {
    const customEl = { listEl: 'ol' };

    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <ProjectItemsList { ...{ ...props, ...customEl } } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const projectItemsList = wrapper.find( 'ProjectItemsList' );
    const ul = projectItemsList.find( 'ul' );
    const ol = projectItemsList.find( 'ol' );

    expect( ul.exists() ).toEqual( false );
    expect( ol.exists() ).toEqual( true );
  } );

  it( 'receives the Trigger component as a prop', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    projectItems.forEach( item => {
      expect( item.prop( 'modalTrigger' )() )
        .toEqual( Trigger() );
    } );
  } );

  it( 'receives the Content component as a prop', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    projectItems.forEach( item => {
      expect( item.prop( 'modalContent' )() )
        .toEqual( Content() );
    } );
  } );

  it( 'receives the projectType as a prop', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    projectItems.forEach( item => {
      expect( item.prop( 'type' ) )
        .toEqual( props.projectType );
    } );
  } );

  it( 'receives the projectId as a prop', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    projectItems.forEach( item => {
      expect( item.prop( 'projectId' ) )
        .toEqual( props.projectId );
    } );
  } );
} );
