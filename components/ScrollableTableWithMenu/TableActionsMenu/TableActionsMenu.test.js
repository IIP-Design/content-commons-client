import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Checkbox } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import TableActionsMenu from './TableActionsMenu';
import { TEAM_VIDEO_PROJECTS_QUERY } from '../TableBody/TableBody';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from '../TablePagination/TablePagination';
import {
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
  () => function VideoDetailsPopup() {
    return <div>VideoDetailsPopup</div>;
  }
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
    const menu = wrapper.find( TableActionsMenu );

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

    const menu = wrapper.find( TableActionsMenu );
    const errorComponent = menu.find( ApolloError );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders null if videoProjects is falsy', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <TableActionsMenu { ...props } />
      </MockedProvider>
    );

    await wait( 0 );
    wrapper.update();

    const menuWrapper = wrapper.find( '.actionsMenu_wrapper' );

    /**
     *  the Query (i.e., `childAt( 0 )` ) returns
     *  `null` but will continue to render the
     *  remainder of the menu (e.g., Modal, Popup, etc.)
     */
    expect( menuWrapper.childAt( 0 ).html() ).toEqual( null );
  } );

  it( 'renders a Checkbox when TEAM_VIDEO_PROJECTS_QUERY is resolved', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( Checkbox );
    const projectsCount = mocks[4].result.data.videoProjects.length;

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

    const checkbox = wrapper.find( Checkbox );
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

    const checkbox = wrapper.find( Checkbox );
    const projectsCount = allCheckedMocks[0].result.data.videoProjects.length;

    expect( checkbox.prop( 'checked' ) ).toEqual( projectsCount === props.selectedItems.size );
  } );

  it( 'renders an indeterminate Checkbox if at least one but not all projects are selected', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( Checkbox );
    const projectsCount = mocks[4].result.data.videoProjects.length;

    expect( checkbox.prop( 'indeterminate' ) )
      .toEqual( projectsCount > props.selectedItems.size );
  } );

  it( 'Checkbox change calls toggleAllItemsSelection', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( Checkbox );

    checkbox.simulate( 'change' );

    expect( props.toggleAllItemsSelection ).toHaveBeenCalled();
  } );

  it( 'componentDidMount sets _isMounted', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();

    inst.componentDidMount();

    expect( inst._isMounted ).toEqual( true );
  } );

  it( 'componentWillUnmount sets _isMounted to false', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();

    inst.componentWillUnmount();

    expect( inst._isMounted ).toEqual( false );
  } );

  it( 'delayUnmount calls a function after a delay', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
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

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();

    // initial state
    expect( inst.state.displayConfirmationMsg ).toEqual( false );

    inst.showConfirmationMsg();
    if ( inst._isMounted ) {
      expect( inst.state.displayConfirmationMsg ).toEqual( true );
    }

    inst.hideConfirmationMsg();
    expect( inst.state.displayConfirmationMsg ).toEqual( false );
    expect( inst.confirmationMsgTimer ).toEqual( null );
  } );

  it( 'calling displayConfirmDelete/handleDeleteCancel sets deleteConfirmOpen to true/false in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
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

    const menu = () => wrapper.find( TableActionsMenu );
    const inst = () => menu().instance();
    const confirmModal = () => menu().find( 'Modal.confirmation' );
    const spy = jest.spyOn( inst(), 'hideConfirmationMsg' );

    // must open the modal before closing it
    inst().showConfirmationMsg();
    wrapper.update();
    expect( inst().state.displayConfirmationMsg ).toEqual( true );
    expect( confirmModal().prop( 'open' ) ).toEqual( true );

    // close the modal
    confirmModal().prop( 'onClose' )();
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'handleDeleteConfirm calls deleteProjects mutate function', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();
    const deleteProjects = jest.fn();
    const args = {
      variables: {
        where: {
          AND: [
            { id_in: [...props.selectedItems.keys()] },
            { status_in: ['DRAFT'] }
          ]
        }
      },
      refetchQueries: [{
        query: TEAM_VIDEO_PROJECTS_QUERY,
        variables: { ...props.variables }
      },
      {
        query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
        variables: {
          team: props.variables.team,
          searchTerm: props.variables.searchTerm
        }
      }]
    };

    inst.handleDeleteConfirm( deleteProjects );

    expect( deleteProjects ).toHaveBeenCalledWith( args );
  } );

  it( 'handleUnpublish calls unpublish mutate function', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
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

    const menu = wrapper.find( TableActionsMenu );
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

    const menu = wrapper.find( TableActionsMenu );
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

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();
    const selectedProjectIds = inst.getSelectedProjectsIds();

    expect( selectedProjectIds ).toEqual( ['ud78', 'ud98'] );
  } );

  it( 'getSelectedProjects returns an array of selected video projects', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();
    const { videoProjects } = mocks[4].result.data;
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

    const menu = wrapper.find( TableActionsMenu );
    const separator = menu.find( '.separator' );
    const unpublishProjects = menu.find( 'UnpublishProjects' );
    const inst = menu.instance();
    const hasSelectedAllDrafts = inst.hasSelectedAllDrafts();
    const selectedProjects = ['ud78', 'ud98'];
    const { videoProjects } = mocks[4].result.data;

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

    const menu = wrapper.find( TableActionsMenu );
    const separator = menu.find( '.separator' );
    const unpublishProjects = menu.find( 'UnpublishProjects' );
    const inst = menu.instance();
    const hasSelectedAllDrafts = inst.hasSelectedAllDrafts();
    const selectedProjects = inst.state.draftProjects;
    const { videoProjects } = mocks[4].result.data;

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

    const menu = wrapper.find( TableActionsMenu );
    const separator = menu.find( '.separator' );
    const unpublishProjects = menu.find( 'UnpublishProjects' );
    const inst = menu.instance();
    const hasSelectedAllDrafts = inst.hasSelectedAllDrafts();
    const { videoProjects } = mocks[4].result.data;

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

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();
    const { videoProjects } = mocks[4].result.data;
    const draftProjects = inst.getDraftProjects( videoProjects );

    expect( draftProjects ).toEqual( inst.state.draftProjects );
    draftProjects.forEach( project => {
      expect( findProjectById( videoProjects, project ).status )
        .toEqual( 'DRAFT' );
    } );
  } );

  it( 'getCachedQuery calls cache.readQuery with the correct arguments', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();
    const cache = { readQuery: jest.fn() };
    const query = TEAM_VIDEO_PROJECTS_QUERY;

    inst.getCachedQuery( cache, query, props.variables );
    expect( cache.readQuery ).toHaveBeenCalledWith( {
      query,
      variables: { ...props.variables }
    } );
  } );

  it( 'handleDrafts sets draftProjects in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();
    const { videoProjects } = mocks[4].result.data;

    /**
     * This test also provides evidence that `handleDrafts`
     * is called on completion of the `Query`. See comment
     * in the component about React Apollo bug and
     * `onCompleted`.
     */
    expect( inst.state.draftProjects ).toEqual( ['ud23', 'ud74'] );
    inst.state.draftProjects.forEach( project => {
      expect( findProjectById( videoProjects, project ).status )
        .toEqual( 'DRAFT' );
    } );
  } );
} );
