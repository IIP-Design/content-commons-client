import { mount } from 'enzyme';
import { Button, Popup } from 'semantic-ui-react';
import DeleteIconButton from './DeleteIconButton';

const props = {
  displayConfirmDelete: jest.fn()
};

const Component = <DeleteIconButton { ...props } />;

describe( '<DeleteIconButton />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders as a Popup', () => {
    const wrapper = mount( Component );
    const popup = wrapper.find( Popup );

    expect( popup.exists() ).toEqual( true );
    expect( popup.prop( 'content' ) ).toEqual( 'Delete Selection(s)' );
  } );

  it( 'renders a Button as its trigger', () => {
    const wrapper = mount( Component );
    const button = wrapper.find( Button );

    expect( button.exists() ).toEqual( true );
  } );

  it( 'renders an image as a child of the Button', () => {
    const wrapper = mount( Component );
    const button = wrapper.find( Button );
    const img = button.find( 'img' );

    expect( img.exists() ).toEqual( true );
    expect( img.prop( 'alt' ) ).toEqual( 'Delete Selection(s)' );
  } );

  it( 'clicking the Button calls displayConfirmDelete', () => {
    const wrapper = mount( Component );
    const button = wrapper.find( Button );

    button.simulate( 'click' );
    expect( props.displayConfirmDelete ).toHaveBeenCalled();
  } );
} );
