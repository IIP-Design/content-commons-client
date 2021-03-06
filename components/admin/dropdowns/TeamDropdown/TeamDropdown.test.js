import { MockedProvider } from '@apollo/client/testing';
import { mount } from 'enzyme';
import sortBy from 'lodash/sortBy';
import wait from 'waait';

import TeamDropdown from './TeamDropdown';

import { suppressActWarning } from 'lib/utils';
import {
  emptyMocks, errorMocks, mocks, nullMocks,
} from './mocks';

const getComponent = ( data, props ) => (
  <MockedProvider mocks={ data } addTypename={ false }>
    <TeamDropdown { ...props } />
  </MockedProvider>
);

describe( '<TeamDropdown />, when receiving no query variables', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  const props = {
    id: 'ceae2',
    label: 'Source',
    name: 'source',
    extraprop: 'some-extra-prop',
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
    const dropdown = wrapper.find( 'TeamDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 2 );
    wrapper.update();

    const dropdown = wrapper.find( 'TeamDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if teams is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'does not crash if teams is []', async () => {
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
    const { teams } = mocks[0].result.data;
    const options = sortBy( teams, team => team.name )
      .map( t => ( { key: t.id, text: t.name, value: t.id } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( formDropdown.prop( 'extraprop' ) )
      .toEqual( props.extraprop );
    expect( dropdownItems.length ).toEqual( teams.length );
  } );
} );

describe( '<TeamDropdown />, when receiving query variables', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  const props = {
    id: 'ceae2',
    label: '',
    name: 'source',
    extraprop: 'some-extra-prop',
    variables: {
      where: {
        name_in: [
          'GPA Design & Editorial',
          'ShareAmerica',
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
    const dropdown = wrapper.find( 'TeamDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );

    await wait( 2 );
    wrapper.update();

    const dropdown = wrapper.find( 'TeamDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if teams is null', async () => {
    const wrapper = mount( NullComponent );

    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( formDropdown.prop( 'options' ) ).toEqual( [] );
  } );

  it( 'does not crash if teams is []', async () => {
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
    const { teams } = mocks[1].result.data;
    const options = sortBy( teams, team => team.name )
      .map( t => ( { key: t.id, text: t.name, value: t.id } ) );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( formDropdown.prop( 'extraprop' ) )
      .toEqual( props.extraprop );
    expect( dropdownItems.length ).toEqual( teams.length );
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
