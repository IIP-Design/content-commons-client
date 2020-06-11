import { mount } from 'enzyme';

import Packages from './Packages';
import { FeaturedContext } from 'context/featuredContext';

import { mockFeaturedContext, fivePackages } from '../mocks';

const mockNoPackages = {
  ...mockFeaturedContext,
  recents: {},
};

const mockExtraPackages = {
  ...mockFeaturedContext,
  recents: {
    ...mockFeaturedContext.recents,
    'package': fivePackages,
  },
};

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

jest.mock( 'components/Package/PackageCard/PackageCard', () => 'package-card' );
jest.mock( 'config', () => ( { PRESS_GUIDANCE_DB_URL: 'mock-guidance-link' } ) );

describe( '<Packages />', () => {
  const returnComponent = state => (
    <FeaturedContext.Provider value={ { state } }>
      <Packages />
    </FeaturedContext.Provider>
  );

  it( 'renders without crashing', () => {
    const wrapper = mount( returnComponent( mockFeaturedContext ) );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'lists all provided packages', () => {
    const wrapper = mount( returnComponent( mockFeaturedContext ) );

    const gridColumn = wrapper.find( 'GridColumn' );

    expect( gridColumn.length ).toEqual( 3 );
    gridColumn.forEach( col => expect( col.hasClass( 'card-min-width' ) ).toEqual( true ) );
    gridColumn.forEach( col => expect( col.hasClass( 'flex-column' ) ).toEqual( false ) );
  } );

  it( 'switches the grid column class to "flex-colum" when more than three packages', () => {
    const wrapper = mount( returnComponent( mockExtraPackages ) );

    const gridColumn = wrapper.find( 'GridColumn' );

    expect( gridColumn.length ).toEqual( 5 );
    gridColumn.forEach( col => expect( col.hasClass( 'card-min-width' ) ).toEqual( false ) );
    gridColumn.forEach( col => expect( col.hasClass( 'flex-column' ) ).toEqual( true ) );
  } );


  it( 'has a header that reader "Latest Guidance Packages"', () => {
    const wrapper = mount( returnComponent( mockFeaturedContext ) );
    const header = wrapper.find( 'h1' );

    expect( header.text() ).toEqual( 'Latest Guidance Packages' );
  } );

  it( 'renders a link to the press guidance archive', () => {
    const linkText = 'archived press guidance database';
    const fullText = `For press guidance and releases from before 04/27/2020, please visit the ${linkText}.`;
    const wrapper = mount( returnComponent( mockFeaturedContext ) );

    const guidanceLink = wrapper.find( 'p.latestPackages_guidance_link' );

    expect( guidanceLink.exists() ).toEqual( true );
    expect( guidanceLink.text() ).toEqual( fullText );
    expect( guidanceLink.find( 'a' ).exists() ).toEqual( true );
    expect( guidanceLink.find( 'a' ).prop( 'href' ) ).toEqual( 'mock-guidance-link' );
    expect( guidanceLink.find( 'a' ).text() ).toEqual( linkText );
  } );

  it( 'does not render anything if no packages present', () => {
    const wrapper = mount( returnComponent( mockNoPackages ) );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.children().length ).toEqual( 0 );
  } );
} );
