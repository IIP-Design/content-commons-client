import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/client/testing';
import sortBy from 'lodash/sortBy';
import UserDropdown, { USERS_QUERY } from './UserDropdown';

import { suppressActWarning } from 'lib/utils';

const props = {
  id: 'abc123',
  label: 'Users',
};

const mocks = [
  {
    request: {
      query: USERS_QUERY,
    },
    result: {
      data: {
        users: [
          {
            id: 'cjrl1omfr002o075614zs8dxz',
            firstName: 'Joe',
            lastName: 'Schmoe',
            email: 'schmoej@america.gov',
            permissions: ['TEAM_ADMIN'],
            team: {
              id: 'cjrkzhvku000f0756l44blw33',
              name: 'GPA Video Production',
            },
          },
          {
            id: 'cjsbxb5ur00t40756z7bzf706',
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'doej@america.gov',
            permissions: ['EDITOR'],
            team: {
              id: 'cjrkzhvku000f0756l44blw33',
              name: 'GPA Video Production',
            },
          },
        ],
      },
    },
  },
];

const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
];

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { users: null },
    },
  },
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { users: [] },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <UserDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <UserDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <UserDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <UserDropdown { ...props } />
  </MockedProvider>
);

describe( '<UserDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const catDropdown = wrapper.find( 'UserDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( catDropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 0 );
    wrapper.update();
    const userDropdown = wrapper.find( 'UserDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( userDropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if categories is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'does not crash if categories is []', async () => {
    const wrapper = mount( EmptyComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { users } = mocks[0].result.data;
    const sortedUsers = sortBy( users, user => user.lastName );
    const semanticUIUsers = sortedUsers.map( user => ( {
      key: user.id,
      text: `${user.lastName}, ${user.firstName}`,
      value: user.id,
    } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( semanticUIUsers );
    expect( dropdownItems.length ).toEqual( users.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="user"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
