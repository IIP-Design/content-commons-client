import { mount } from 'enzyme';
import UploadCompletionTracker from './UploadCompletionTracker';

const props = {
  fields: [
    '', '', '',
  ],
};

const Component = <UploadCompletionTracker { ...props } />;

describe( '<UploadCompletionTracker />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct number of fields to complete', () => {
    const wrapper = mount( Component );
    const label = () => wrapper.find( 'Label' );
    const toComplete = () => wrapper.prop( 'fields' ).filter( field => !field );

    // initial fields to complete: 3 remaining
    expect( label().contains( toComplete().length ) ).toEqual( true );

    // partial completion: 1 remaining
    wrapper.setProps( { fields: [
      'a', 'b', '',
    ] } );
    wrapper.update();
    expect( label().contains( toComplete().length ) ).toEqual( true );

    // completion: 0 remaining
    wrapper.setProps( { fields: [
      'a', 'b', 'c',
    ] } );
    wrapper.update();
    expect( label().contains( toComplete().length ) ).toEqual( false );
  } );

  it( 'renders the correct style objects', () => {
    const wrapper = mount( Component );
    const label = () => wrapper.find( 'Label' );
    const icon = () => wrapper.find( 'Icon' );
    const show = { display: 'inline-block' };
    const hide = { display: 'none' };

    // initial style objects
    expect( label().prop( 'style' ) ).toEqual( show );
    expect( icon().prop( 'style' ) ).toEqual( hide );

    // partial completion
    wrapper.setProps( { fields: [
      'a', 'b', '',
    ] } );
    expect( label().prop( 'style' ) ).toEqual( show );
    expect( icon().prop( 'style' ) ).toEqual( hide );

    // completion
    wrapper.setProps( { fields: [
      'a', 'b', 'c',
    ] } );
    wrapper.update();
    expect( label().prop( 'style' ) ).toEqual( hide );
    expect( icon().prop( 'style' ) ).toEqual( show );
  } );

  it( 'renders a default display prop of "show"', () => {
    const wrapper = mount( Component );

    expect( props.display ).toEqual( undefined );
    expect( wrapper.prop( 'display' ) ).toEqual( 'show' );
  } );
} );
