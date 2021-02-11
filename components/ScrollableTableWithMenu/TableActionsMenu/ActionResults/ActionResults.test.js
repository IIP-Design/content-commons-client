import { mount, shallow } from 'enzyme';
import ActionResults from './ActionResults';
import ActionResultsItem from './ActionResultsItem/ActionResultsItem';
import ActionResultsError from './ActionResultsError/ActionResultsError';

import { failure } from './mocks';

const props = { failures: [failure] };

const Component = <ActionResults />;

const ComponentError = <ActionResults { ...props } />;

describe( '<ActionResults />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders a single ActionResultsItem when no errors provided', () => {
    const wrapper = mount( Component );

    const item = wrapper.find( ActionResultsItem );

    expect( item.exists() ).toEqual( true );
    expect( item.length ).toBe( 1 );

    const error = wrapper.find( ActionResultsError );

    expect( error.exists() ).toEqual( false );
  } );

  it( 'renders ActionResultsError with props when errors provided', () => {
    const wrapper = mount( ComponentError );

    const error = wrapper.find( ActionResultsError );

    expect( error.props() ).toEqual( failure );

    expect( error.exists() ).toEqual( true );
    expect( error.length ).toEqual( 1 );
  } );
} );
