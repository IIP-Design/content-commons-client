import { GraphQLError } from 'graphql';
import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/client/testing';
import sortBy from 'lodash/sortBy';
import SocialPlatformDropdown, { SOCIAL_PLATFORMS_QUERY } from './SocialPlatformDropdown';
import { addEmptyOption, suppressActWarning } from 'lib/utils';

const props = {
  id: '123xyz',
  label: 'Platform',
};

const mocks = [
  {
    request: {
      query: SOCIAL_PLATFORMS_QUERY,
    },
    result: {
      data: {
        socialPlatforms: [
          {
            id: 'ck9h3m3g626bd07201gh712vk',
            name: 'Twitter',
          },
          {
            id: 'ck9h3m9bl26bm0720rm69c60s',
            name: 'Facebook',
          },
          {
            id: 'ck9h3meu626bw07201o36tapc',
            name: 'Instagram',
          },
          {
            id: 'ck9h3mpap26c40720mzobnbgm',
            name: 'Instagram Story',
          },
          {
            id: 'ck9h3mzx026ce0720dp1f0ue8',
            name: 'Snapchat',
          },
          {
            id: 'ck9h3naq526cp0720i4u3uqlv',
            name: 'WhatsApp',
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
      ...mocks[0].result,
      errors: [new GraphQLError( 'There was an error.' )],
    },
  },
];

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { socialPlatforms: null },
    },
  },
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { socialPlatforms: [] },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <SocialPlatformDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <SocialPlatformDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <SocialPlatformDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <SocialPlatformDropdown { ...props } />
  </MockedProvider>
);

describe( '<SocialPlatformDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'SocialPlatformDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 2 );
    wrapper.update();

    const dropdown = wrapper.find( 'SocialPlatformDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if socialPlatforms is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 2 );
    wrapper.update();

    const formDropdown = wrapper.find( 'FormDropdown' );
    const options = addEmptyOption( [] );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
  } );

  it( 'does not crash if socialPlatforms is []', async () => {
    const wrapper = mount( EmptyComponent );

    await wait( 2 );
    wrapper.update();

    const formDropdown = wrapper.find( 'FormDropdown' );
    const options = addEmptyOption( [] );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 2 );
    wrapper.update();

    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { socialPlatforms } = mocks[0].result.data;
    const options = sortBy( socialPlatforms, platform => platform.name )
      .map( platform => ( {
        key: platform.id,
        text: platform.name,
        value: platform.id,
      } ) );

    expect( formDropdown.prop( 'options' ) )
      .toEqual( addEmptyOption( options ) );
    expect( dropdownItems.length ).toEqual( socialPlatforms.length + 1 );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 2 );
    wrapper.update();

    const dropdown = wrapper.find( 'Dropdown div[name="social"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
