import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { titleCase } from 'lib/utils';
import CategoryDropdown, { CATEGORIES_QUERY } from './CategoryDropdown';

jest.mock( 'next-server/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

const props = {
  id: '123xyz',
  label: 'Categories',
  locale: 'en-us'
};

const mocks = [
  {
    request: {
      query: CATEGORIES_QUERY,
      variables: { locale: props.locale }
    },
    result: {
      data: {
        categories: [
          {
            id: 'cjubblzw815qb0756cfwa9vd7',
            translations: [
              {
                id: 'cjubbldkt0ur20756zjfw5209',
                name: 'about america'
              }
            ]
          },
          {
            id: 'cjubblzw815qc07563nzatqyn',
            translations: [
              {
                id: 'cjubbldsp0uta0756p4as8gl9',
                name: 'arts & culture'
              }
            ]
          },
          {
            id: 'cjubblzw915qd0756808n3h3q',
            translations: [
              {
                id: 'cjubbldz10uvi0756o7pg0lqm',
                name: 'democracy & civil society'
              }
            ]
          },
          {
            id: 'cjubblzw915qe07560zkz9xas',
            translations: [
              {
                id: 'cjubble530uxq0756q5bphm9c',
                name: 'economic opportunity'
              }
            ]
          },
          {
            id: 'cjubblzwk15qk0756nenwp3rz',
            translations: [
              {
                id: 'cjubbleb70uzy0756tay96s62',
                name: 'education'
              }
            ]
          },
          {
            id: 'cjubblzwq15r10756m11zntim',
            translations: [
              {
                id: 'cjubbleh10v2607568m3kisep',
                name: 'environment'
              }
            ]
          },
          {
            id: 'cjubblzwq15r20756m3108d8s',
            translations: [
              {
                id: 'cjubbleli0v4e075641kjd0jj',
                name: 'geography'
              }
            ]
          },
          {
            id: 'cjubblzwq15r30756l8e8zdvu',
            translations: [
              {
                id: 'cjubbler60v6m0756231jvsgj',
                name: 'global issues'
              }
            ]
          },
          {
            id: 'cjubblzwq15r40756kb7neely',
            translations: [
              {
                id: 'cjubblevs0v8u075668mzno2t',
                name: 'health'
              }
            ]
          },
          {
            id: 'cjubblzwr15r507566hzkgmpk',
            translations: [
              {
                id: 'cjubblf0v0vb207568iibzp1t',
                name: 'human rights'
              }
            ]
          },
          {
            id: 'cjubblzwr15r607568f7sy9pz',
            translations: [
              {
                id: 'cjubblf5m0vda07565wesiogo',
                name: 'press & journalism'
              }
            ]
          },
          {
            id: 'cjubblzwr15r70756o5jr69p9',
            translations: [
              {
                id: 'cjubblfap0vfi0756pva51gji',
                name: 'good governance'
              }
            ]
          },
          {
            id: 'cjubblzws15rb0756pi1gv0mn',
            translations: [
              {
                id: 'cjubblffg0vhq0756gutom6cs',
                name: 'religion & values'
              }
            ]
          },
          {
            id: 'cjubblzws15rc0756ypyls4bf',
            translations: [
              {
                id: 'cjubblfkk0vjy0756zr2qwjii',
                name: 'science & technology'
              }
            ]
          },
          {
            id: 'cjubblzx615sc0756oh8pk89e',
            translations: [
              {
                id: 'cjubblfp90vm60756cdzur3vo',
                name: 'sports'
              }
            ]
          }
        ]
      }
    }
  }
];

const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { categories: null }
    }
  }
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { categories: [] }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <CategoryDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <CategoryDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <CategoryDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <CategoryDropdown { ...props } />
  </MockedProvider>
);

describe( '<CategoryDropdown />', () => {
  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const catDropdown = wrapper.find( 'CategoryDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( catDropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const catDropdown = wrapper.find( 'CategoryDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( catDropdown.contains( errorMsg ) ).toEqual( true );
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
    const { categories } = mocks[0].result.data;
    const semanticUICats = categories.map( category => ( {
      key: category.id,
      value: category.id,
      text: category.translations.length
        ? titleCase( category.translations[0].name )
        : ''
    } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( semanticUICats );
    expect( dropdownItems.length ).toEqual( categories.length );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown > div' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
