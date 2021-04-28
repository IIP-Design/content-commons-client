import { mount } from 'enzyme';
import FilterSelectionItem from '../FilterSelectionItem';

describe( '<FilterSelectionItem />, for a non-date filter', () => {
  let wrapper;
  let filterItem;

  const props = {
    value: 'graphic',
    name: 'postTypes',
    label: 'Graphic',
    single: false,
    onClick: jest.fn(),
    className: 'some-class-value',
  };

  beforeEach( () => {
    wrapper = mount( <FilterSelectionItem { ...props } /> );
    filterItem = wrapper.find( 'FilterSelectionItem' );
  } );

  it( 'renders without crashing', () => {
    expect( filterItem.exists() ).toEqual( true );
  } );

  it( 'renders the correct HTML element', () => {
    const elem = filterItem.find( `button.${props.className}` );

    expect( elem.exists() ).toEqual( true );
    expect( elem.prop( 'onClick' ) ).toBeTruthy();
    expect( elem.prop( 'type' ) ).toEqual( 'button' );
  } );

  it( 'renders the correct label', () => {
    expect( filterItem.contains( props.label ) ).toEqual( true );
  } );

  it( 'renders the correct visually hidden text', () => {
    const hidden = filterItem.find( 'VisuallyHidden' );

    expect( hidden.contains( 'remove filter for ' ) ).toEqual( true );
  } );

  it( 'renders an image with empty alt value', () => {
    expect( filterItem.find( 'img' ).prop( 'alt' ) ).toEqual( '' );
  } );
} );

describe( '<FilterSelectionItem />, for a date filter', () => {
  let wrapper;
  let filterItem;

  const props = {
    value: 'recent',
    name: 'date',
    label: 'Any Time',
    single: true,
    onClick: jest.fn(),
    className: 'some-class-value',
  };

  beforeEach( () => {
    wrapper = mount( <FilterSelectionItem { ...props } /> );
    filterItem = wrapper.find( 'FilterSelectionItem' );
  } );

  it( 'renders without crashing', () => {
    expect( filterItem.exists() ).toEqual( true );
  } );

  it( 'renders the correct HTML element', () => {
    const elem = filterItem.find( `span.${props.className}` );

    expect( elem.exists() ).toEqual( true );
    expect( elem.prop( 'onClick' ) ).toBeFalsy();
    expect( elem.prop( 'type' ) ).toBeFalsy();
  } );

  it( 'renders the correct visually hidden text', () => {
    const hidden = filterItem.find( 'VisuallyHidden' );

    expect( hidden.contains( 'date range ' ) ).toEqual( true );
  } );

  it( 'does not render an image', () => {
    expect( filterItem.find( 'img' ).exists() ).toEqual( false );
  } );
} );
