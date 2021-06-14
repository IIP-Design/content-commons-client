import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/client/testing';
import PlaybookPreview from 'components/admin/Previews/PlaybookPreview/PlaybookPreview';
import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';
import { suppressActWarning } from 'lib/utils';
import { mockItem } from 'components/Playbook/mocks';

jest.mock(
  'components/Playbook/Playbook',
  () => function Playbook() { return ''; },
);

const props = {
  id: '1234',
  item: mockItem,
};

const undefinedItemProps = {
  id: '1234',
  item: undefined,
};

const mocks = [
  {
    request: {
      query: PLAYBOOK_QUERY,
      variables: { id: props.id },
    },
    result: {
      data: {
        playbook: mockItem,
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

const undefinedMocks = [
  {
    ...mocks[0],
    result: {
      data: { playbook: undefined },
    },
  },
];

describe( '<PlaybookPreview />, for server side render', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders the Playbook without crashing', async () => {
    const Component = (
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <PlaybookPreview { ...props } />
      </MockedProvider>
    );
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const playbook = wrapper.find( 'Playbook' );

    expect( playbook.exists() ).toEqual( true );
  } );

  it( 'renders an unavailable message if !item and !data.playbook', async () => {
    const Component = (
      <MockedProvider mocks={ undefinedMocks } addTypename={ false }>
        <PlaybookPreview { ...undefinedItemProps } />
      </MockedProvider>
    );
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const container = wrapper.find( 'PlaybookPreview' );
    const msg = 'Preview is unavailable.';

    expect( container.contains( msg ) ).toEqual( true );
  } );
} );

describe( '<PlaybookPreview />, for client side render', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <PlaybookPreview { ...undefinedItemProps } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const container = wrapper.find( 'PlaybookPreview' );
    const msg = 'Loading Playbook preview...';

    expect( container.contains( msg ) ).toEqual( true );
  } );

  it( 'renders the Playbook without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const playbook = wrapper.find( 'Playbook' );

    expect( playbook.exists() ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const ErrorComponent = (
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <PlaybookPreview { ...undefinedItemProps } />
      </MockedProvider>
    );
    const wrapper = mount( ErrorComponent );

    await wait( 0 );
    wrapper.update();
    const container = wrapper.find( 'PlaybookPreview' );
    const error = errorMocks[0].result.errors[0];

    expect( container.contains( error.message ) ).toEqual( true );
  } );
} );
