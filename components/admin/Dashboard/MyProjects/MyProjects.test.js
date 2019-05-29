import { shallow } from 'enzyme';
import MyProjects from './MyProjects';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );
jest.mock( 'next-server/dynamic', () => () => 'ImageDetailsPopup' );

const props = {
  columnMenu: [
    { name: 'author', label: 'AUTHOR' },
    { name: 'categories', label: 'CATEGORIES' },
    { name: 'createdAt', label: 'DATE' },
  ],
  persistentTableHeaders: [
    { name: 'projectTitle', label: 'PROJECT TITLE' },
    { name: 'visibility', label: 'VISIBILITY' },
    { name: 'updatedAt', label: 'MODIFIED' },
    { name: 'team', label: 'TEAM' }
  ],
  user: { team: { name: 'IIP Video Production' } }
};

const Component = <MyProjects { ...props } />;

describe( '<MyProjects />', () => {
  it.only( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );
} );
