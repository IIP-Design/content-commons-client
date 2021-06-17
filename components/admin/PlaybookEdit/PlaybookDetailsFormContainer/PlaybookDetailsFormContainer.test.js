import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';

import PlaybookDetailsFormContainer from './PlaybookDetailsFormContainer';
import { UPDATE_PLAYBOOK_MUTATION } from 'lib/graphql/queries/playbook';

jest.mock(
  'components/admin/PackageCreate/PackageForm/PackageForm',
  () => function PlaybookForm() { return ''; },
);

const id = 'playbook-123';

const mocks = [
  {
    request: {
      query: UPDATE_PLAYBOOK_MUTATION,
      variables: {
        data: {
          title: 'China Communications Playbook',
          type: 'PLAYBOOK',
        },
        where: { id },
      },
    },
    result: {
      data: {
        updatePlaybook: {
          __typename: 'Playbook',
          id,
          title: 'China Communications Playbook',
          createdAt: '2020-01-28T15:42:06.826Z',
          updatedAt: '2020-02-06T12:43:31.110Z',
          publishedAt: '',
          type: 'PLAYBOOK',
          assetPath: `playbook/2020/01/commons.america.gov_${id}`,
          desc: 'Internal description',
          status: 'DRAFT',
          visibility: 'INTERNAL',
          author: {
            __typename: 'User',
            id: 'ckm0t5njy0bnv0841sg0ba6qg',
            firstName: 'Terri',
            lastName: 'Regan',
          },
          policy: {
            __typename: 'PolicyPriority',
            id: 'ckoj2zvbm01s60941ztd6mubf',
            name: 'policy456',
            theme: '#c10230',
          },
          team: {
            __typename: 'Team',
            id: 'cknemcwr0003n0941g5u0y80q',
            name: 'GPA Global Campaigns Strategy Unit',
          },
          categories: [],
          tags: [],
        },
      },
    },
  },
];

const props = {
  children: <div>just another child node</div>,
  playbook: {
    id: 'playbook123',
    title: 'COVID-19 Recovery',
    type: 'Playbook',
    team: {
      id: 'team789',
      name: 'team name',
    },
    categories: ['category123', 'category456'],
    tags: [],
    policy: {
      name: 'policy456',
    },
    visibility: 'INTERNAL',
    desc: 'Lorem Ipsum',
  },
  setIsFormValid: jest.fn( () => true ),
};


const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <PlaybookDetailsFormContainer { ...props } />
  </MockedProvider>
);

describe( '<PlaybookDetailsFormContainer />', () => {
  let wrapper;
  let formContainer;

  beforeEach( () => {
    wrapper = mount( Component );
    formContainer = wrapper.find( 'PlaybookDetailsFormContainer' );
  } );

  it( 'renders without crashing', () => {
    expect( formContainer.exists() ).toEqual( true );
  } );
} );
