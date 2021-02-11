import { mount } from 'enzyme';
import { List } from 'semantic-ui-react';
import ActionResultsItem from './ActionResultsItem';

const component = (
  <List>
    <ActionResultsItem />
  </List>
);

const componentError = (
  <List>
    <ActionResultsItem isError>
      <div id="child-item" />
    </ActionResultsItem>
  </List>
);

describe( '<ActionResultsItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( component );
    const item = wrapper.find( ActionResultsItem );

    expect( item.exists() ).toEqual( true );
  } );

  it( 'renders red exclamation icon on error', () => {
    const wrapper = mount( componentError );
    const icon = wrapper.find( List.Icon );

    expect( icon.exists() ).toEqual( true );
    expect( icon.props() ).toHaveProperty( 'color', 'red' );
    expect( icon.props() ).toHaveProperty( 'name', 'exclamation triangle' );
  } );

  it( 'renders green checkmark icon on no error', () => {
    const wrapper = mount( component );
    const icon = wrapper.find( List.Icon );

    expect( icon.exists() ).toEqual( true );
    expect( icon.props() ).toHaveProperty( 'color', 'green' );
    expect( icon.props() ).toHaveProperty( 'name', 'check circle outline' );
  } );

  it( 'renders children', () => {
    const wrapper = mount( componentError );
    const child = wrapper.find( '#child-item' );

    expect( child.exists() ).toEqual( true );
  } );
} );
