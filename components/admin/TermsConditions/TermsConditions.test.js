import { mount } from 'enzyme';
import TermsConditions from './TermsConditions';

const props = {
  error: false,
  handleOnChange: jest.fn()
};

const Component = <TermsConditions { ...props } />;

describe( '<TermsConditions />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders matching `id` and label `for` attribute values', () => {
    const wrapper = mount( Component );
    const checkbox = wrapper.find( 'input[type="checkbox"]' );
    const label = wrapper.find( 'label' );
    const attrValue = 'termsConditions';

    expect( checkbox.prop( 'id' ) ).toEqual( attrValue );
    expect( label.prop( 'htmlFor' ) ).toEqual( attrValue );
  } );

  it( 'renders the correct label message', () => {
    const wrapper = mount( Component );
    const label = wrapper.find( 'label' );
    const msg = 'By uploading these files I agree to the Content Commons Terms of Use and licensing agreements. By selecting Public visibility, I understand that my content will be available to the public for general use.';

    expect( label.text() ).toEqual( msg );
  } );

  it( 'renders correctly the Terms of Use link', () => {
    const wrapper = mount( Component );
    const link = wrapper.find( 'Link' );
    const href = '/privacy';

    expect( link.prop( 'href' ) ).toEqual( href );
    expect( link.text() ).toEqual( 'Terms of Use' );
  } );

  it( 'has the required attribute', () => {
    const wrapper = mount( Component );
    const checkbox = wrapper.find( 'input[type="checkbox"]' );

    expect( checkbox.prop( 'required' ) ).toEqual( true );
  } );

  it( 'onChange calls props.handleOnChange', () => {
    const wrapper = mount( Component );
    const checkbox = wrapper.find( 'input[type="checkbox"]' );

    checkbox.simulate( 'change' );
    expect( props.handleOnChange ).toHaveBeenCalled();
  } );

  it( 'receives the correct error value', () => {
    const wrapper = mount( Component );

    // initial value
    expect( wrapper.prop( 'error' ) ).toEqual( props.error );

    // new value
    wrapper.setProps( { error: true } );
    expect( wrapper.prop( 'error' ) ).toEqual( !props.error );
  } );
} );
