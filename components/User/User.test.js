import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';

import User, { CURRENT_USER_QUERY } from './User';

const props = {
  children: jest.fn( () => <div>child component</div> ),
};

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        authenticatedUser: {
          id: 'cjrl1omfr002o075614zs8dxz',
          firstName: 'Ragnar',
          lastName: 'Lothbrock',
          email: 'lothbrockr@america.gov',
          jobTitle: '',
          country: 'United States',
          city: 'Washington, DC',
          howHeard: '',
          permissions: ['TEAM_ADMIN'],
          team: {
            id: 'cjrkzhvku000f0756l44blw33',
            name: 'GPA Video Production',
            contentTypes: ['VIDEO'],
          },
        },
      },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <User { ...props } />
  </MockedProvider>
);

const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';

  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};

describe( '<User />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const user = wrapper.find( 'User' );
    const child = wrapper.find( 'User div' );

    expect( user.exists() ).toEqual( true );
    expect( child.text() ).toEqual( 'child component' );
  } );
} );
