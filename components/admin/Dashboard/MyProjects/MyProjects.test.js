import { shallow } from 'enzyme';

import MyProjects from './MyProjects';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );
jest.mock( 'next/dynamic', () => () => 'dynamically-imported-component' );

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
    { name: 'team', label: 'TEAM' },
  ],
  user: { team: { name: 'IIP Video Production' } },
};

const Component = <MyProjects { ...props } />;

describe( '<MyProjects />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );
} );
