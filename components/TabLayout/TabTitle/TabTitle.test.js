import { mount } from 'enzyme';

import TabTitle from './TabTitle';

const props = {
  title: 'Test Title',
  isActiveTab: true,
  handleOnClick: jest.fn()
};

describe( 'TabTitle', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <TabTitle { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'shows to the provided title as button text', () => {
    const wrapper = mount( <TabTitle { ...props } /> );

    const btn = wrapper.find( 'button' );

    expect( btn.text() ).toStrictEqual( props.title );
  } );

  it( 'fires the handleOnClick function when clicked', () => {
    const wrapper = mount( <TabTitle { ...props } /> );

    const btn = wrapper.find( 'button' );

    btn.simulate( 'click' );
    expect( props.handleOnClick ).toHaveBeenCalledTimes( 1 );
  } );
} );
