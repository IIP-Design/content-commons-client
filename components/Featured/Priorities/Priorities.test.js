/* eslint-disable jest/no-disabled-tests */
import { mount } from 'enzyme';

import Priorities from './Priorities';
import { mockFeaturedContext, mockPrioritiesProps } from '../mocks';

jest.mock( 'components/SignedUrlImage/SignedUrlImage', () => 'signed-url-image' );
jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

describe.skip( '<Priorities />', () => {
  const props = {
    categories: [],
    label: 'China',
    term: 'china',
    user: null,
    locale: 'en-us',
  };
  const Component = <Priorities { ...props } />;

  it( 'renders a priorities section without crashing', () => {
    const wrapper = mount( Component );
    const section = wrapper.find( 'section.priorities' );

    expect( wrapper.exists() ).toEqual( true );
    expect( section.exists() ).toEqual( true );
  } );

  it( 'has a header that reads "Department Priority: [Term]"', () => {
    const wrapper = mount( Component );
    const header = wrapper.find( 'Header' );

    expect( header.exists() ).toEqual( true );
    expect( header.find( 'h1' ).text() ).toEqual( `Department Priority: ${mockPrioritiesProps.label}` );
  } );

  it( 'includes a Browse All link with a link to the search results for the provided term', () => {
    const wrapper = mount( Component );
    const link = wrapper.find( 'Link' );

    expect( link.exists() ).toEqual( true );
    expect( link.find( 'a' ).text() ).toBe( 'Browse All' );
    expect( link.find( 'a' ).hasClass( 'browseAll' ) ).toEqual( true );
    expect( link.prop( 'href' ).pathname ).toBe( '/results' );
    expect( link.prop( 'href' ).query.sortBy ).toEqual( 'relevance' );
    expect( link.prop( 'href' ).query.term ).toEqual( mockPrioritiesProps.term );
    expect( link.prop( 'href' ).query.categories ).toEqual(
      mockPrioritiesProps.categories.map( cat => cat.key ),
    );
  } );

  it( 'renders an image for the initial item next to two items with metadata', () => {
    const wrapper = mount( Component );
    const gridColumns = wrapper.find( 'GridColumn' );

    expect( gridColumns.length ).toEqual( 2 );

    const primary = gridColumns.first().find( 'Modal' );

    expect( primary.find( 'signed-url-image' ).exists() ).toEqual( true );
    expect( primary.find( 'signed-url-image' ).prop( 'url' ) ).toEqual(
      mockFeaturedContext.priorities[mockPrioritiesProps.term][0].thumbnail,
    );

    const itemGroup = gridColumns.at( 1 ).find( 'ItemGroup Modal' );

    expect( itemGroup.exists() ).toEqual( true );
    expect( itemGroup.length ).toEqual( 2 );

    itemGroup.forEach( ( item, i ) => {
      expect( item.find( 'signed-url-image' ).prop( 'url' ) ).toEqual(
        mockFeaturedContext.priorities[mockPrioritiesProps.term][i + 1].thumbnail,
      );

      const header = item.find( 'div.header' );

      expect( header.text() ).toEqual(
        mockFeaturedContext.priorities[mockPrioritiesProps.term][i + 1].title,
      );
      expect( item.find( 'span.categories' ).exists() ).toEqual( true );
      expect( item.find( 'span.date' ).exists() ).toEqual( true );
    } );
  } );

  it( 'does not render a priorities section when the provided term is not included the prioritie context item', () => {
    const newProps = {
      ...mockPrioritiesProps,
      term: 'invalid',
    };

    const wrapper = mount( Component );

    const section = wrapper.find( 'section' );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.children().length ).toEqual( 0 );
    expect( section.exists() ).toEqual( false );
  } );
} );

describe.skip( '<Priorities /> with insufficient items', () => {
  const props = {
    categories: [],
    label: 'China',
    term: 'china',
    user: null,
    locale: 'en-us',
  };
  const Component = <Priorities { ...props } />;

  it( 'does not crash when there are insufficient items', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render a priorities section when when a priority contains fewer than three items', () => {
    const wrapper = mount( Component );

    const section = wrapper.find( 'section.priorities' );

    expect( wrapper.children().length ).toEqual( 0 );
    expect( section.exists() ).toEqual( false );
  } );
} );
