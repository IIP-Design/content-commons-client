import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Checkbox } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { TEAM_VIDEO_PROJECTS_QUERY } from '../TableBody/TableBody';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from '../TablePagination/TablePagination';
import TableActionsMenu, {
  DELETE_VIDEO_PROJECTS_MUTATION,
  UNPUBLISH_VIDEO_PROJECTS_MUTATION
} from './TableActionsMenu';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );
jest.mock( 'next-server/dynamic', () => () => 'ImageDetailsPopup' );

const props = {
  displayActionsMenu: true,
  variables: {
    team: 'IIP Video Production',
    searchTerm: '',
    first: 4,
    skip: 0
  },
  selectedItems: new Map( [['ud78', true], ['ud98', true]] ),
  handleResetSelections: jest.fn(),
  toggleAllItemsSelection: jest.fn()
};

const mocks = [
  {
    request: {
      query: DELETE_VIDEO_PROJECTS_MUTATION,
      variables: {
        where: {
          id_in: [...props.selectedItems.keys()]
        }
      }
    },
    result: {
      data: {
        deleteProjects: {
          count: [...props.selectedItems.keys()].length
        }
      }
    }
  },
  {
    request: {
      query: UNPUBLISH_VIDEO_PROJECTS_MUTATION,
      variables: {
        data: { status: 'DRAFT', visibility: 'INTERNAL' },
        where: {
          AND: [
            { id_in: [...props.selectedItems.keys()] },
            { status_not: 'DRAFT' }
          ]
        }
      }
    },
    result: {
      data: {
        unpublish: {
          count: [...props.selectedItems.keys()].length
        }
      }
    }
  },
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: {
        team: props.variables.team,
        searchTerm: props.variables.searchTerm
      }
    },
    result: {
      data: {
        videoProjects: [
          { id: 'ud78' },
          { id: 'ud98' },
          { id: 'ud64' },
          { id: 'ud23' },
          { id: 'ud74' }
        ]
      }
    }
  },
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
      variables: {
        team: props.variables.team,
        searchTerm: props.variables.searchTerm
      }
    },
    result: {
      data: {
        videoProjects: [
          { id: 'ud64' },
          { id: 'ud23' }
        ]
      }
    }
  },
  {
    request: {
      query: TEAM_VIDEO_PROJECTS_QUERY,
      variables: { ...props.variables }
    },
    result: {
      data: {
        videoProjects: [
          {
            id: 'ud78',
            createdAt: '2019-05-09T18:33:03.368Z',
            updatedAt: '2019-05-09T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State'
            },
            author: {
              id: 'a928',
              firstName: 'Jane',
              lastName: 'Doe'
            },
            projectTitle: 'Test Title 1',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      locale: 'en-us'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'ud98',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State'
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe'
            },
            projectTitle: 'Test Title 2',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      locale: 'en-us'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'ud64',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State'
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe'
            },
            projectTitle: 'Test Title 2',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      locale: 'en-us'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'ud23',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State'
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe'
            },
            projectTitle: 'Test Title 2',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      locale: 'en-us'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'ud74',
            createdAt: '2019-05-12T18:33:03.368Z',
            updatedAt: '2019-05-12T18:33:03.368Z',
            team: {
              id: 't888',
              name: 'IIP Video Production',
              organization: 'Department of State'
            },
            author: {
              id: 'a287',
              firstName: 'Joe',
              lastName: 'Schmoe'
            },
            projectTitle: 'Test Title 2',
            status: 'PUBLISHED',
            visibility: 'INTERNAL',
            thumbnails: {
              url: 'https://thumbnailurl.com',
              alt: 'some alt text',
            },
            categories: [
              {
                id: '38s',
                translations: [
                  {
                    id: '832',
                    name: 'about america',
                    language: {
                      locale: 'en-us'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <TableActionsMenu { ...props } />
  </MockedProvider>
);

describe( '<TableActionsMenu />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const menu = wrapper.find( TableActionsMenu );

    expect( menu.exists() ).toEqual( true );
    expect( menu.contains( 'Loading....' ) ).toEqual( true );
  } );

  it( 'renders error message if an error is returned', async () => {
    const errorMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
          variables: {
            team: props.variables.team,
            searchTerm: props.variables.searchTerm
          }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

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
    const nullMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
          variables: {
            team: props.variables.team,
            searchTerm: props.variables.searchTerm
          }
        },
        result: {
          data: { videoProjects: null }
        }
      }
    ];

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

  it( 'renders a Checkbox when TEAM_VIDEO_PROJECTS_COUNT_QUERY is resolved', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const checkbox = wrapper.find( Checkbox );
    const projectsCount = mocks[2].result.data.videoProjects.length;

    expect( checkbox.exists() ).toEqual( true );
    expect( checkbox.prop( 'disabled' ) ).toEqual( projectsCount === 0 );
  } );

  it( 'renders a disabled Checkbox if no videoProjects are returned', async () => {
    const emptyMocks = [
      {
        request: {
          query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
          variables: {
            team: props.variables.team,
            searchTerm: props.variables.searchTerm
          }
        },
        result: {
          data: { videoProjects: [] }
        }
      }
    ];

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
        where: { id_in: [...props.selectedItems.keys()] }
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
            { status_not: 'DRAFT' }
          ]
        }
      }
    };

    inst.handleUnpublish( unpublish );

    expect( unpublish ).toHaveBeenCalledWith( args );
  } );

  it( 'handleStatusVisibility sets status and visibility fields', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const menu = wrapper.find( TableActionsMenu );
    const inst = menu.instance();
    const items = [...props.selectedItems.keys()];
    const projects = [
      { id: 'ud78', status: 'PUBLISHED', visibility: 'PUBLIC' },
      { id: 'ud98', status: 'PUBLISHED', visibility: 'PUBLIC' }
    ];

    inst.handleStatusVisibility( items, projects );

    projects.forEach( project => {
      expect( project.status ).toEqual( 'DRAFT' );
      expect( project.visibility ).toEqual( 'INTERNAL' );
    } );
  } );
} );
