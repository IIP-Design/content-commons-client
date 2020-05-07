import { mount } from 'enzyme';
import TeamProjects from './TeamProjects';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock( 'next/dynamic', () => () => 'ScrollableTableWithMenu' );

const props = {
  columnMenu: [
    { name: 'categories', label: 'CATEGORIES' },
    { name: 'updatedAt', label: 'MODIFIED' },
    { name: 'team', label: 'TEAM' },
  ],
  persistentTableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'createdAt', label: 'DATE' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'author', label: 'AUTHOR' },
  ],
  user: {
    team: {
      name: 'IIP Video Production',
      contentTypes: ['VIDEO', 'PACKAGE'],
    },
  },
};

jest.mock( 'context/authContext', () => ( {
  useAuth: jest.fn( () => true ),
} ) );

const Component = <TeamProjects { ...props } />;

describe( '<TeamProjects />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );
} );
