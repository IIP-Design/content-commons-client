import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import TableActionsMenu from './TableActionsMenu';
import { TEAM_VIDEO_PROJECTS_QUERY } from '../TableBody/TableBody';
import {
  actionResult,
  allCheckedMocks,
  emptyMocks,
  errorMocks,
  mocks,
  nullMocks,
  props
} from './mocks';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock(
  'next-server/dynamic',
  () => function VideoDetailsPopup() { return ''; }
);

jest.mock(
  './DeleteIconButton/DeleteIconButton',
  () => function DeleteIconButton() { return ''; }
);

jest.mock(
  './DeleteProjects/DeleteProjects',
  () => function DeleteProjects() { return ''; }
);

jest.mock(
  './UnpublishProjects/UnpublishProjects',
  () => function UnpublishProjects() { return ''; }
);

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <TableActionsMenu { ...props } />
  </MockedProvider>
);

const findProjectById = ( array, projectId ) => (
  array.find( n => n.id === projectId )
);

describe( '<TableActionsMenu />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const menu = wrapper.find( 'TableActionsMenu' );

    expect( menu.exists() ).toEqual( true );
    expect( menu.contains( 'Loading....' ) ).toEqual( true );
  } );

  it( 'renders error message if an error is returned', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <TableActionsMenu { ...props } />
      </MockedProvider>
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const errorComponent = menu.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders empty if videoProjects is falsy', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <TableActionsMenu { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();
    const menuWrapper = wrapper.find( '.actionsMenu_wrapper' );

    expect( menuWrapper.children().length ).toEqual( 0 );
  } );

  it( 'renders a Checkbox when TEAM_VIDEO_PROJECTS_QUERY is resolved', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( 'Checkbox' );
    const projectsCount = mocks[2].result.data.videoProjects.length;

    expect( checkbox.exists() ).toEqual( true );
    expect( checkbox.prop( 'disabled' ) ).toEqual( projectsCount === 0 );
    expect( checkbox.prop( 'checked' ) ).toEqual( projectsCount === props.selectedItems.size );
  } );

  it( 'renders a disabled Checkbox if no videoProjects are returned', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ emptyMocks } addTypename={ false }>
        <TableActionsMenu { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( 'Checkbox' );
    const projectsCount = emptyMocks[0].result.data.videoProjects.length;

    expect( checkbox.exists() ).toEqual( true );
    expect( checkbox.prop( 'disabled' ) ).toEqual( projectsCount === 0 );
  } );

  it( 'renders a checked Checkbox if all projects are selected', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ allCheckedMocks } addTypename={ false }>
        <TableActionsMenu { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( 'Checkbox' );
    const projectsCount = allCheckedMocks[0].result.data.videoProjects.length;

    expect( checkbox.prop( 'checked' ) ).toEqual( projectsCount === props.selectedItems.size );
  } );

  it( 'renders an indeterminate Checkbox if at least one but not all projects are selected', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( 'Checkbox' );
    const projectsCount = mocks[2].result.data.videoProjects.length;

    expect( checkbox.prop( 'indeterminate' ) )
      .toEqual( projectsCount > props.selectedItems.size );
  } );

  it( 'Checkbox change calls toggleAllItemsSelection', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( 'Checkbox' );

    checkbox.simulate( 'change' );
    expect( props.toggleAllItemsSelection ).toHaveBeenCalled();
  } );

  it( 'componentDidMount sets _isMounted', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();

    inst.componentDidMount();
    expect( inst._isMounted ).toEqual( true );
  } );

  it( 'componentWillUnmount sets _isMounted to false', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();

    inst.componentWillUnmount();
    expect( inst._isMounted ).toEqual( false );
  } );

  it( 'delayUnmount calls a function after a delay', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const fn = jest.fn();
    const timer = inst.confirmationMsgTimer;
    const delay = inst.CONFIRMATION_MSG_DELAY;

    inst.delayUnmount( fn, timer, delay );
    await wait( delay );
    expect( fn ).toHaveBeenCalled();
  } );

  it( 'calling showConfirmationMsg/hideConfirmationMsg sets displayConfirmationMsg to true/false in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const results = [{ id: 'ud23' }, { id: 'ud74' }];

    // initial state
    expect( inst.state.displayConfirmationMsg ).toEqual( false );

    inst.showConfirmationMsg( results );
    if ( inst._isMounted ) {
      expect( inst.state.actionFailures ).toEqual( [] );
      expect( inst.state.displayConfirmationMsg ).toEqual( true );
    }

    inst.hideConfirmationMsg();
    expect( inst.state.actionFailures ).toEqual( [] );
    expect( inst.state.displayConfirmationMsg ).toEqual( false );
    expect( inst.confirmationMsgTimer ).toEqual( null );
  } );

  it( 'calling displayConfirmDelete/handleDeleteCancel sets deleteConfirmOpen to true/false in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();

    // initial state
    expect( inst.state.deleteConfirmOpen ).toEqual( false );

    inst.displayConfirmDelete();
    expect( inst.state.deleteConfirmOpen ).toEqual( true );

    inst.handleDeleteCancel();
    expect( inst.state.deleteConfirmOpen ).toEqual( false );
  } );

  it( 'closing confirmation modal calls hideConfirmationMsg', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = () => wrapper.find( 'TableActionsMenu' );
    const inst = () => menu().instance();
    const confirmModal = () => menu().find( 'Modal.confirmation' );
    const spy = jest.spyOn( inst(), 'hideConfirmationMsg' );
    const results = [{ id: 'ud23' }, { id: 'ud74' }];

    // must open the modal before closing it
    inst().showConfirmationMsg( results );
    wrapper.update();
    expect( inst().state.actionFailures ).toEqual( [] );
    expect( inst().state.displayConfirmationMsg ).toEqual( true );
    expect( confirmModal().prop( 'open' ) ).toEqual( true );

    // close the modal
    confirmModal().prop( 'onClose' )();
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'handleActionResult adds result to actionFailures if it has an error', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = () => wrapper.find( 'TableActionsMenu' );
    const inst = () => menu().instance();
    // must open the modal before adding action results
    inst().displayConfirmDelete();
    wrapper.update();
    inst().handleActionResult( actionResult );
    wrapper.update();
    expect( inst().state.actionFailures ).toEqual( expect.arrayContaining( [actionResult] ) );
  } );

  it( 'handleActionCompleted refetches teamVideProjects, teamVideoProjectsCount, and calls showConfirmationMsg', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();

    const teamVideoProjectsRefetch = jest.spyOn( menu.prop( 'teamVideoProjects' ), 'refetch' );
    const teamVideoProjectsCountRefetch = jest.spyOn( menu.prop( 'teamVideoProjectsCount' ), 'refetch' );
    const showConfirmationMsg = jest.spyOn( inst, 'showConfirmationMsg' );

    inst.handleActionCompleted();

    expect( teamVideoProjectsRefetch ).toHaveBeenCalledWith( props.variables );
    expect( teamVideoProjectsCountRefetch ).toHaveBeenCalledWith( {
      team: props.variables.team,
      searchTerm: props.variables.searchTerm
    } );
    expect( showConfirmationMsg ).toHaveBeenCalled();
  } );

  it.skip( 'handleUnpublish calls unpublish mutate function', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const unpublish = jest.fn();
    const args = {
      variables: {
        data: { status: 'DRAFT', visibility: 'INTERNAL' },
        where: {
          AND: [
            { id_in: [...props.selectedItems.keys()] },
            { status: 'PUBLISHED' }
          ]
        }
      }
    };

    inst.handleUnpublish( unpublish );
    expect( unpublish ).toHaveBeenCalledWith( args );
  } );

  it( 'handleStatus sets status field', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const items = [...props.selectedItems.keys()];
    const projects = [
      { id: 'ud78', status: 'PUBLISHED' },
      { id: 'ud98', status: 'PUBLISHED' }
    ];

    inst.handleStatus( items, projects );
    projects.forEach( project => {
      expect( project.status ).toEqual( 'DRAFT' );
    } );
  } );

  it( 'transformSelectedItemsMap returns a transformed array of selected item objects', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const transformed = inst.transformSelectedItemsMap();

    expect( transformed ).toEqual(
      [{ id: 'ud78', value: true }, { id: 'ud98', value: true }]
    );
  } );

  it( 'getSelectedProjectsIds returns an array of selected project ids', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const selectedProjectIds = inst.getSelectedProjectsIds();

    expect( selectedProjectIds ).toEqual( ['ud78', 'ud98'] );
  } );

  it( 'getSelectedProjects returns an array of selected video projects', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const { videoProjects } = mocks[2].result.data;
    const selectedProjectIds = [...props.selectedItems.keys()];
    const selectedProjects = inst.getSelectedProjects( videoProjects );

    expect( selectedProjects.length ).toEqual( props.selectedItems.size );
    selectedProjects.forEach( ( project, i ) => {
      expect( project.id ).toEqual( selectedProjectIds[i] );
    } );
  } );

  it( 'hasSelectedAllDrafts returns false if all selected projects have PUBLISHED status', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const separator = menu.find( '.separator' );
    const unpublishProjects = menu.find( 'UnpublishProjects' );
    const inst = menu.instance();
    const hasSelectedAllDrafts = inst.hasSelectedAllDrafts();
    const selectedProjects = ['ud78', 'ud98'];
    const { videoProjects } = mocks[2].result.data;

    selectedProjects.forEach( project => {
      expect( findProjectById( videoProjects, project ).status )
        .toEqual( 'PUBLISHED' );
    } );
    expect( hasSelectedAllDrafts ).toEqual( false );
    expect( separator.exists() ).toEqual( !hasSelectedAllDrafts );
    expect( unpublishProjects.exists() ).toEqual( !hasSelectedAllDrafts );
  } );

  it( 'hasSelectedAllDrafts returns true if all selected projects have DRAFT status', async () => {
    const newProps = {
      ...props,
      ...{
        selectedItems: new Map( [['ud23', true], ['ud74', true]] )
      }
    };

    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <TableActionsMenu { ...newProps } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const separator = menu.find( '.separator' );
    const unpublishProjects = menu.find( 'UnpublishProjects' );
    const inst = menu.instance();
    const hasSelectedAllDrafts = inst.hasSelectedAllDrafts();
    const selectedProjects = ['ud23', 'ud74'];
    const { videoProjects } = mocks[2].result.data;

    selectedProjects.forEach( project => {
      expect( findProjectById( videoProjects, project ).status )
        .toEqual( 'DRAFT' );
    } );
    expect( hasSelectedAllDrafts ).toEqual( true );
    expect( separator.exists() ).toEqual( !hasSelectedAllDrafts );
    expect( unpublishProjects.exists() ).toEqual( !hasSelectedAllDrafts );
  } );

  it( 'hasSelectedAllDrafts returns false if one selected project has DRAFT status', async () => {
    const newProps = {
      ...props,
      ...{
        selectedItems: new Map( [['ud78', true], ['ud74', true]] )
      }
    };

    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <TableActionsMenu { ...newProps } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const separator = menu.find( '.separator' );
    const unpublishProjects = menu.find( 'UnpublishProjects' );
    const inst = menu.instance();
    const hasSelectedAllDrafts = inst.hasSelectedAllDrafts();
    const { videoProjects } = mocks[2].result.data;

    expect( findProjectById( videoProjects, 'ud78' ).status )
      .toEqual( 'PUBLISHED' );
    expect( findProjectById( videoProjects, 'ud74' ).status )
      .toEqual( 'DRAFT' );
    expect( hasSelectedAllDrafts ).toEqual( false );
    expect( separator.exists() ).toEqual( !hasSelectedAllDrafts );
    expect( unpublishProjects.exists() ).toEqual( !hasSelectedAllDrafts );
  } );

  it( 'getDraftProjects returns an array of draft project ids', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const { videoProjects } = mocks[2].result.data;
    const draftProjects = inst.getDraftProjects( videoProjects );

    expect( draftProjects ).toEqual( ['ud23', 'ud74'] );
    draftProjects.forEach( project => {
      expect( findProjectById( videoProjects, project ).status )
        .toEqual( 'DRAFT' );
    } );
  } );

  it.skip( 'getCachedQuery calls cache.readQuery with the correct arguments', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( 'TableActionsMenu' );
    const inst = menu.instance();
    const cache = { readQuery: jest.fn() };
    const query = TEAM_VIDEO_PROJECTS_QUERY;

    inst.getCachedQuery( cache, query, props.variables );
    expect( cache.readQuery ).toHaveBeenCalledWith( {
      query,
      variables: { ...props.variables }
    } );
  } );
} );
