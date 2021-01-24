/* eslint-disable jest/no-disabled-tests */
import { mount } from 'enzyme';

import Packages from './Packages';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

jest.mock( 'components/Package/PackageCard/PackageCard', () => 'package-card' );
jest.mock( 'config', () => ( { PRESS_GUIDANCE_DB_URL: 'mock-guidance-link' } ) );

// Removed context dependency; skipped tests; todo - rewrite tests w/o contextw
describe( '<Packages />', () => {
  let Component;
  let wrapper;

  const props = {
    postType: 'package',
    user: null,
  };

  beforeEach( () => {
    Component = <Packages { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it.skip( 'lists all provided packages', () => {
    const gridColumn = wrapper.find( 'GridColumn' );

    expect( gridColumn.length ).toEqual( 3 );
    gridColumn.forEach( col => expect( col.hasClass( 'card-min-width' ) ).toEqual( true ) );
    gridColumn.forEach( col => expect( col.hasClass( 'flex-column' ) ).toEqual( false ) );
  } );

  it.skip( 'switches the grid column class to "flex-colum" when more than three packages', () => {
    const gridColumn = wrapper.find( 'GridColumn' );

    expect( gridColumn.length ).toEqual( 5 );
    gridColumn.forEach( col => expect( col.hasClass( 'card-min-width' ) ).toEqual( false ) );
    gridColumn.forEach( col => expect( col.hasClass( 'flex-column' ) ).toEqual( true ) );
  } );


  it.skip( 'has a header that reader "Latest Guidance Packages"', () => {
    const header = wrapper.find( 'h1' );

    expect( header.text() ).toEqual( 'Latest Guidance Packages' );
  } );

  it.skip( 'renders a link to the press guidance archive', () => {
    const linkText = 'archived press guidance database';
    const fullText = `For press guidance and releases from before 04/27/2020, please visit the ${linkText}.`;

    const guidanceLink = wrapper.find( 'p.latestPackages_guidance_link' );

    expect( guidanceLink.exists() ).toEqual( true );
    expect( guidanceLink.text() ).toEqual( fullText );
    expect( guidanceLink.find( 'a' ).exists() ).toEqual( true );
    expect( guidanceLink.find( 'a' ).prop( 'href' ) ).toEqual( 'mock-guidance-link' );
    expect( guidanceLink.find( 'a' ).text() ).toEqual( linkText );
  } );

  it.skip( 'does not render anything if no packages present', () => {
    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.children().length ).toEqual( 0 );
  } );
} );
