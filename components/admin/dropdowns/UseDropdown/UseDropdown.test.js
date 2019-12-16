import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import sortBy from 'lodash/sortBy';
import { addEmptyOption } from 'lib/utils';
import UseDropdown from './UseDropdown';
import {
  emptyMocks, errorMocks, mocks, nullMocks
} from './mocks';


const props = {
  id: 'ceae2',
  label: 'Type/Use',
  type: 'Video'
};

const imageProps = {
  ...props,
  type: 'Image'
};

const documentProps = {
  id: 'adsf3',
  label: 'Release Type',
  name: 'use-20',
  type: 'Document'
};

describe( '<UseDropdown /> for video type', () => {
  /**
   * @todo Suppress React 16.8 `act()` warnings globally.
   * The React team's fix won't be out of alpha until 16.9.0.
   * @see https://github.com/facebook/react/issues/14769
   */
  const consoleError = console.error;
  beforeAll( () => {
    const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';
    jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
      if ( !args[0].includes( actMsg ) ) {
        consoleError( ...args );
      }
    } );
  } );

  afterAll( () => {
    // restore console.error
    console.error = consoleError;
  } );

  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <UseDropdown { ...props } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <UseDropdown { ...props } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <UseDropdown { ...props } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <UseDropdown { ...props } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'UseDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'UseDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if enumValues is null', async () => {
    const wrapper = mount( NullComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'does not crash if enumValues is []', async () => {
    const wrapper = mount( EmptyComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { videoUses } = mocks[0].result.data;
    const semanticUIValues = sortBy( videoUses, use => use.name )
      .map( u => ( { key: u.id, text: u.name, value: u.id } ) );
    const options = addEmptyOption( semanticUIValues );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( videoUses.length + 1 );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown [role="listbox"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );

describe( '<UseDropdown /> for image type', () => {
  const consoleError = console.error;
  beforeAll( () => {
    const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';
    jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
      if ( !args[0].includes( actMsg ) ) {
        consoleError( ...args );
      }
    } );
  } );

  afterAll( () => {
    // restore console.error
    console.error = consoleError;
  } );

  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <UseDropdown { ...imageProps } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <UseDropdown { ...imageProps } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <UseDropdown { ...imageProps } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <UseDropdown { ...imageProps } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'UseDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'UseDropdown' );
    const error = errorMocks[1].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if imageUses is null', async () => {
    const wrapper = mount( NullComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'does not crash if imageUses is []', async () => {
    const wrapper = mount( EmptyComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { imageUses } = mocks[1].result.data;
    const semanticUIValues = sortBy( imageUses, use => use.name )
      .map( u => ( { key: u.id, text: u.name, value: u.id } ) );
    const options = addEmptyOption( semanticUIValues );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( imageUses.length + 1 );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown [role="listbox"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );

describe( '<UseDropdown /> for document type', () => {
  const consoleError = console.error;
  beforeAll( () => {
    const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';
    jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
      if ( !args[0].includes( actMsg ) ) {
        consoleError( ...args );
      }
    } );
  } );

  afterAll( () => {
    // restore console.error
    console.error = consoleError;
  } );

  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <UseDropdown { ...documentProps } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <UseDropdown { ...documentProps } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <UseDropdown { ...documentProps } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <UseDropdown { ...documentProps } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'UseDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'UseDropdown' );
    const error = errorMocks[2].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if documentUses is null', async () => {
    const wrapper = mount( NullComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'does not crash if documentUses is []', async () => {
    const wrapper = mount( EmptyComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { documentUses } = mocks[2].result.data;
    const semanticUIValues = sortBy( documentUses, use => use.name )
      .map( u => ( { key: u.id, text: u.name, value: u.id } ) );
    const options = addEmptyOption( semanticUIValues );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( documentUses.length + 1 );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown [role="listbox"]' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( documentProps.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( documentProps.id );
  } );
} );
