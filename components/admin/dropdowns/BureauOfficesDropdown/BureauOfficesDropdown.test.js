import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import sortBy from 'lodash/sortBy';
import { addEmptyOption } from 'lib/utils';
import BureauOfficesDropdown, { BUREAU_OFFICES_QUERY } from './BureauOfficesDropdown';
import { bureaus } from './mocks';

const props = {
  id: '123xyz',
  label: 'Bureau/Offices'
};

const mocks = [
  {
    request: {
      query: BUREAU_OFFICES_QUERY
    },
    result: {
      data: { bureaus }
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
      data: { bureaus: null }
    }
  }
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { bureaus: [] }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <BureauOfficesDropdown { ...props } />
  </MockedProvider>
);

const ErrorComponent = (
  <MockedProvider mocks={ errorMocks } addTypename={ false }>
    <BureauOfficesDropdown { ...props } />
  </MockedProvider>
);

const NullComponent = (
  <MockedProvider mocks={ nullMocks } addTypename={ false }>
    <BureauOfficesDropdown { ...props } />
  </MockedProvider>
);

const EmptyComponent = (
  <MockedProvider mocks={ emptyMocks } addTypename={ false }>
    <BureauOfficesDropdown { ...props } />
  </MockedProvider>
);

describe( '<BureauOfficesDropdown />', () => {
  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'BureauOfficesDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'BureauOfficesDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if bureaus is null', async () => {
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

  it( 'does not crash if bureaus is []', async () => {
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
    const semanticUIOptions = sortBy( bureaus, bureau => bureau.name )
      .map( bureau => ( {
        key: bureau.id,
        text: bureau.name,
        value: bureau.id
      } ) );
    const options = addEmptyOption( semanticUIOptions );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( bureaus.length + 1 );
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
