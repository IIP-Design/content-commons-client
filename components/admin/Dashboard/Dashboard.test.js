import { mount } from 'enzyme';

import Dashboard from './Dashboard';

jest.mock( 'components/User/UserAdmin', () => () => 'user-admin' );
jest.mock( './TeamProjects/TeamProjects', () => () => 'team-projects' );

describe( '<Dashboard />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <Dashboard /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders all the menu items with the appropriate title', () => {
    const wrapper = mount( <Dashboard /> );

    const menuItems = wrapper.find( 'MenuItem' );

    expect( menuItems ).toHaveLength( 5 );

    expect( menuItems.at( 0 ).contains( 'Overview' ) ).toEqual( true );
    expect( menuItems.at( 1 ).contains( 'My Projects' ) ).toEqual( true );
    expect( menuItems.at( 2 ).contains( 'Team Projects' ) ).toEqual( true );
    expect( menuItems.at( 3 ).contains( 'Favorites' ) ).toEqual( true );
    expect( menuItems.at( 4 ).contains( 'Collections' ) ).toEqual( true );
  } );

  it( 'disables tabs for items that have not yet been implemented', () => {
    const wrapper = mount( <Dashboard /> );

    const menuItems = wrapper.find( 'MenuItem' );

    // Ensure that Team Projects item is not disabled
    expect( menuItems.at( 2 ).prop( 'disabled' ) ).toEqual( undefined );

    // Ensure that remaining items are disabled
    expect( menuItems.at( 0 ).prop( 'disabled' ) ).toEqual( true );
    expect( menuItems.at( 1 ).prop( 'disabled' ) ).toEqual( true );
    expect( menuItems.at( 3 ).prop( 'disabled' ) ).toEqual( true );
    expect( menuItems.at( 4 ).prop( 'disabled' ) ).toEqual( true );
  } );

  it( 'defaults to the Team Projects tab selected', () => {
    const wrapper = mount( <Dashboard /> );

    const menuItems = wrapper.find( 'MenuItem' );
    const tabPane = wrapper.find( 'TabPane' );

    // Ensure that Team Projects item is active
    expect( menuItems.at( 2 ).prop( 'active' ) ).toEqual( true );
    expect( tabPane.contains( 'team-projects' ) ).toEqual( true );
    expect( tabPane.prop( 'active' ) ).toEqual( true );

    // Ensure that remaining items are not active
    expect( menuItems.at( 0 ).prop( 'active' ) ).toEqual( false );
    expect( menuItems.at( 1 ).prop( 'active' ) ).toEqual( false );
    expect( menuItems.at( 3 ).prop( 'active' ) ).toEqual( false );
    expect( menuItems.at( 4 ).prop( 'active' ) ).toEqual( false );
  } );
} );
