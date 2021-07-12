import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';
import wait from 'waait';

import PolicyPriorityDropdown from './PolicyPriorityDropdown';

import { addEmptyOption, suppressActWarning } from 'lib/utils';
import {
  emptyMocks, errorMocks, mocks, nullMocks,
} from './mocks';

const getComponent = ( data, props ) => (
  <MockedProvider mocks={ data } addTypename={ false }>
    <PolicyPriorityDropdown { ...props } />
  </MockedProvider>
);

describe( '<PolicyPriorityDropdown />, when receiving no query variables', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  const props = {
    id: 'ceae2',
    label: 'Policy Priority',
    name: 'policyPriority',
  };

  let Component;
  let ErrorComponent;
  let NullComponent;
  let EmptyComponent;

  beforeEach( () => {
    Component = getComponent( mocks, props );
    ErrorComponent = getComponent( errorMocks, props );
    NullComponent = getComponent( nullMocks, props );
    EmptyComponent = getComponent( emptyMocks, props );
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'PolicyPriorityDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 2 );
    wrapper.update();

    const dropdown = wrapper.find( 'PolicyPriorityDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if policyPriorities is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [
      {
        key: '-',
        text: '-',
        value: null,
      },
    ] );
  } );

  it( 'does not crash if policyPriorities is []', async () => {
    const wrapper = mount( EmptyComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [
      {
        key: '-',
        text: '-',
        value: null,
      },
    ] );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { policyPriorities } = mocks[0].result.data;
    const options = policyPriorities.map( p => ( {
      key: p.id,
      text: p.name,
      value: p.id,
    } ) );

    addEmptyOption( options );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( policyPriorities.length + 1 );
  } );
} );

describe( '<PolicyPriorityDropdown />, when receiving query variables', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  const props = {
    id: 'ceae2',
    label: '',
    name: 'source',
    variables: {
      where: {
        name_in: [
          'Alliances and Partnerships',
          'Covid-19 Recovery',
        ],
      },
    },
  };

  let Component;
  let ErrorComponent;
  let NullComponent;
  let EmptyComponent;

  beforeEach( () => {
    Component = getComponent( mocks, props );
    ErrorComponent = getComponent( errorMocks, props );
    NullComponent = getComponent( nullMocks, props );
    EmptyComponent = getComponent( emptyMocks, props );
  } );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'PolicyPriorityDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 2 );
    wrapper.update();

    const dropdown = wrapper.find( 'PolicyPriorityDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if policyPriorities is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [
      {
        key: '-',
        text: '-',
        value: null,
      },
    ] );
  } );

  it( 'does not crash if policyPriorities is []', async () => {
    const wrapper = mount( EmptyComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [
      {
        key: '-',
        text: '-',
        value: null,
      },
    ] );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { policyPriorities } = mocks[1].result.data;
    const options = policyPriorities.map( p => ( {
      key: p.id,
      text: p.name,
      value: p.id,
    } ) );

    addEmptyOption( options );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( policyPriorities.length + 1 );
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
