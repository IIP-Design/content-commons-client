import { shallow } from 'enzyme';
import TeamProjects from './TeamProjects';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );
jest.mock( 'next-server/dynamic', () => () => 'ImageDetailsPopup' );

const props = {
  columnMenu: [
    { name: 'categories', label: 'CATEGORIES' },
    { name: 'updatedAt', label: 'MODIFIED' },
    { name: 'team', label: 'TEAM' }
  ],
  persistentTableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'createdAt', label: 'DATE' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'author', label: 'AUTHOR' }
  ],
  user: { team: { name: 'IIP Video Production' } }
};

const Component = <TeamProjects { ...props } />;

describe( '<TeamProjects />', () => {
  it.only( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );
} );
