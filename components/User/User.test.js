import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import User, { CURRENT_USER_QUERY } from './User';

const props = {
  children: jest.fn( () => <div>child component</div> )
};

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
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
          permissions: [
            'TEAM_ADMIN'
          ],
          team: {
            id: 'cjrkzhvku000f0756l44blw33',
            name: 'GPA Video Production'
          }
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <User { ...props } />
  </MockedProvider>
);

describe( '<User />', () => {
  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const child = wrapper.find( 'div' );

    expect( child.text() ).toEqual( 'child component' );
  } );
} );
