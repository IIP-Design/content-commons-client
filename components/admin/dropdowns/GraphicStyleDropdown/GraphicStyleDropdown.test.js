import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import sortBy from 'lodash/sortBy';
import GraphicStyleDropdown, { GRAPHIC_STYLES_QUERY } from './GraphicStyleDropdown';
import { addEmptyOption, suppressActWarning } from 'lib/utils';

const props = {
  id: '123xyz',
  label: 'Style',
};

const mocks = [
  {
    request: {
      query: GRAPHIC_STYLES_QUERY,
    },
    result: {
      data: {
        graphicStyles: [
          {
            id: 'ck9h3ka3o269y0720t7wzp5uq',
            name: 'GIF',
          },
          {
            id: 'ck9h3koe426aa0720y421wmk3',
            name: 'Clean',
          },
          {
            id: 'ck9h3kyb326ak0720wkbk01q6',
            name: 'Info/Stat',
          },
          {
            id: 'ck9h3l7zn26au0720ialhqtg4',
            name: 'Quote',
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
      data: { graphicStyles: null },
    },
  },
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { graphicStyles: [] },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <GraphicStyleDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <GraphicStyleDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <GraphicStyleDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <GraphicStyleDropdown { ...props } />
  </MockedProvider>
);

const OmitComponent = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <GraphicStyleDropdown { ...props } omit={ ['Clean'] } />
  </MockedProvider>
);


describe( '<GraphicStyleDropdown />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'GraphicStyleDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'GraphicStyleDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if graphicStyles is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const options = addEmptyOption( [] );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
  } );

  it( 'does not crash if graphicStyles is []', async () => {
    const wrapper = mount( EmptyComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const options = addEmptyOption( [] );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { graphicStyles } = mocks[0].result.data;
    const options = sortBy( graphicStyles, style => style.name ).map( style => ( {
      key: style.id,
      text: style.name,
      value: style.id,
    } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( addEmptyOption( options ) );
    expect( dropdownItems.length ).toEqual( graphicStyles.length + 1 );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown div[name="style"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );

  it( 'does not display the omitted option', async () => {
    const wrapper = mount( OmitComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const { graphicStyles } = mocks[0].result.data;

    const options = sortBy( graphicStyles, style => style.name )
      .filter( style => style.name !== 'Clean' )
      .map( style => ( {
        key: style.id,
        text: style.name,
        value: style.id,
      } ) );


    expect( formDropdown.prop( 'options' ) ).toEqual( addEmptyOption( options ) );
  } );
} );
