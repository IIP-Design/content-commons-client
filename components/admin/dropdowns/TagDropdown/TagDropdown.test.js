import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { titleCase } from 'lib/utils';
import TagDropdown, { TAG_QUERY } from './TagDropdown';
import { rtlTags, tags } from './mocks';

jest.mock( 'next-server/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

const props = {
  id: '123xyz',
  label: 'Tags',
  locale: 'en-us'
};

const rtlProps = {
  ...props,
  locale: 'fa-ir'
};

const mocks = [
  {
    request: {
      query: TAG_QUERY,
      variables: { locale: props.locale }
    },
    result: {
      data: { tags }
    }
  },
  {
    request: {
      query: TAG_QUERY,
      variables: { locale: rtlProps.locale }
    },
    result: {
      data: { tags: rtlTags }
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
      data: { tags: null }
    }
  }
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { tags: [] }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <TagDropdown { ...props } />
  </MockedProvider>
);

const RTLComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <TagDropdown { ...rtlProps } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <TagDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <TagDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <TagDropdown { ...props } />
  </MockedProvider>
);

describe( '<TagDropdown />', () => {
  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const tagDropdown = wrapper.find( 'TagDropdown' );
    const loading = <p>Loading...</p>;

    expect( tagDropdown.exists() ).toEqual( true );
    expect( tagDropdown.contains( loading ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const tagDropdown = wrapper.find( 'TagDropdown' );
    const errorMsg = 'Error!';

    expect( tagDropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if tags is null', async () => {
    const wrapper = mount( NullComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'does not crash if tags is []', async () => {
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
    const semanticUITags = tags.map( tag => ( {
      key: tag.id,
      value: tag.id,
      text: tag.translations.length
        ? titleCase( tag.translations[0].name )
        : ''
    } ) )
      .sort( ( tagA, tagB ) => {
        const textA = tagA.text.toLowerCase();
        const textB = tagB.text.toLowerCase();
        if ( textA < textB ) return -1;
        if ( textA > textB ) return 1;
        return 0;
      } );

    expect( formDropdown.prop( 'options' ) ).toEqual( semanticUITags );
    expect( formDropdown.prop( 'className' ) ).toEqual( 'ltr' );
    expect( dropdownItems.length ).toEqual( tags.length );
  } );

  it( 'renders rtl className for a rtl language', async () => {
    const wrapper = mount( RTLComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'className' ) ).toEqual( 'rtl' );
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
