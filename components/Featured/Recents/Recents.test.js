/* eslint-disable jest/no-disabled-tests */
/* eslint-disable no-undef */
import { mount } from 'enzyme';

import Recents from './Recents';
import { capitalizeFirst } from 'lib/utils';

jest.mock( 'components/SignedUrlImage/SignedUrlImage', () => 'signed-url-image' );
jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

const getPostLabel = type => {
  switch ( type ) {
    case 'courses':
    case 'page':
    case 'package':
      return '';
    case 'post':
      return 'Article';
    case 'document':
      return 'Press Releases and Guidance';
    default:
      return typeof type === 'string' ? capitalizeFirst( type ) : '';
  }
};

describe.skip( '<Recents />', () => {
  const props = {
    postType: 'video',
    user: null,
    locale: 'en-us',
  };
  const Component = <Recents { ...props } />;
  // const wrapper = mount( Component );

  const types = [
    'graphic', 'post', 'video',
  ];

  it( 'renders a recents section without crashing', () => {
    types.forEach( type => {
      // const wrapper = mount( returnComponent( type ) );

      const section = wrapper.find( 'section.recents' );

      expect( wrapper.exists() ).toEqual( true );
      expect( section.exists() ).toEqual( true );
    } );
  } );

  it( 'the header reads "Latest [Content Type]"', () => {
    types.forEach( type => {
      // const wrapper = mount( returnComponent( type ) );
      const header = wrapper.find( 'Header' );

      expect( header.exists() ).toEqual( true );
      expect( header.find( 'h1' ).text() ).toEqual( `Latest ${getPostLabel( type )}s` );
    } );
  } );

  it( 'includes a Browse All link with a link to the provided content type search results', () => {
    types.forEach( type => {
      // const wrapper = mount( returnComponent( type ) );
      const link = wrapper.find( 'Link' );

      expect( link.exists() ).toEqual( true );
      expect( link.find( 'a' ).text() ).toBe( 'Browse All' );
      expect( link.find( 'a' ).hasClass( 'browseAll' ) ).toEqual( true );
      expect( link.prop( 'href' ).pathname ).toBe( '/results' );
      expect( link.prop( 'href' ).query.postTypes[0] ).toEqual( type );
      expect( link.prop( 'href' ).query.sortBy ).toEqual( 'published' );
    } );
  } );

  it( 'renders an image for the initial item next to two items with metadata', () => {
    types.forEach( type => {
      // const wrapper = mount( returnComponent( type ) );
      const gridColumns = wrapper.find( 'GridColumn' );

      expect( gridColumns.length ).toEqual( 2 );

      const primary = gridColumns.first().find( 'Modal' );

      expect( primary.find( 'signed-url-image' ).exists() ).toEqual( true );
      // expect( primary.find( 'signed-url-image' ).prop( 'url' ) )
      // .toEqual( mockFeaturedContext.recents[type][0].thumbnail );

      const itemGroup = gridColumns.at( 1 ).find( 'ItemGroup Modal' );

      expect( itemGroup.exists() ).toEqual( true );
      expect( itemGroup.length ).toEqual( 2 );

      itemGroup.forEach( ( item, i ) => {
        // expect( item.find( 'signed-url-image' ).prop( 'url' ) )
        //   .toEqual( mockFeaturedContext.recents[type][i + 1].thumbnail );

        // const header = item.find( 'div.header' );

        // expect( header.text() ).toEqual( mockFeaturedContext.recents[type][i + 1].title );
        expect( item.find( 'span.categories' ).exists() ).toEqual( true );
        expect( item.find( 'span.date' ).exists() ).toEqual( true );
      } );
    } );
  } );
} );

describe.skip( '<Recents /> with insufficient items', () => {
  const props = {
    postType: 'video',
    user: null,
    locale: 'en-us',
  };
  const Component = <Recents { ...props } />;
  // const wrapper = mount( Component );

  const types = [
    'graphic', 'post', 'video',
  ];

  it( 'does not crash when there are insufficient items', () => {
    types.forEach( () => {
      // const wrapper = mount( returnComponent( type ) );

      expect( wrapper.exists() ).toEqual( true );
    } );
  } );

  it( 'does not render a recents section when specified type does not exist or contains fewer than three items', () => {
    types.forEach( () => {
      // const wrapper = mount( returnComponent( type ) );

      const section = wrapper.find( 'section.recents' );

      expect( wrapper.children().length ).toEqual( 0 );
      expect( section.exists() ).toEqual( false );
    } );
  } );
} );
