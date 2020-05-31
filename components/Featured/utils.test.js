import { getFeatured, getCategories } from './utils';
import { manyCategoriesItem, mockPromises, oneCategoriesItem, twoCategoriesItem } from './mocks';
import * as parser from 'lib/elastic/parser';

describe( 'getCategories', () => {
  it( 'returns the categories from an item as a lowercase string separated by a ·', () => {
    const categories = getCategories( twoCategoriesItem );

    expect( twoCategoriesItem.categories.length ).toEqual( 2 );
    expect( categories ).toEqual( 'geography · global issues' );
  } );

  it( 'does not add a trailing · if only one category present', () => {
    const categories = getCategories( oneCategoriesItem );

    expect( oneCategoriesItem.categories.length ).toEqual( 1 );
    expect( categories ).toEqual( 'geography' );
  } );

  it( 'it only returns the first three categories provided', () => {
    const categories = getCategories( manyCategoriesItem );

    expect( manyCategoriesItem.categories.length ).toEqual( 4 );
    expect( categories.split( ' · ' ).length ).toEqual( 3 );
    expect( categories ).toEqual( 'geography · global issues · democracy & civil society' );
  } );
} );

describe( 'getFeatured', () => {
  const { promise1, promise2, promise3, promise4, promise5 } = mockPromises;

  it( 'Sends a "LOAD_FEATURED_SUCCESS" dispatch with expected priorities and recents', async () => {
    const normalizeSpy = jest.spyOn( parser, 'normalizeItem' )
      .mockResolvedValue( { item: 'item' } );

    const promises = [
      promise1, promise2, promise3, promise4,
    ];
    const dispatch = jest.fn();

    await getFeatured( promises, dispatch );

    const expectedDispatch = {
      type: 'LOAD_FEATURED_SUCCESS',
      payload: {
        priorities: { 'coronavirus covid': [promise1] },
        recents: {
          video: [promise2],
          'package': [promise3],
        },
      },
    };

    expect( dispatch ).toHaveBeenCalledTimes( 1 );
    expect( dispatch ).toHaveBeenCalledWith( expectedDispatch );

    normalizeSpy.mockReset();
  } );

  it( 'Sends a "LOAD_FEATURED_FAILED" dispatch when a promise returns an error', async () => {
    const normalizeSpy = jest.spyOn( parser, 'normalizeItem' )
      .mockResolvedValue( { item: 'item' } );

    const promises = [
      promise1, promise2, promise5,
    ];
    const dispatch = jest.fn();

    await getFeatured( promises, dispatch );

    const errorDispatch = { type: 'LOAD_FEATURED_FAILED' };

    expect( dispatch ).toHaveBeenCalledTimes( 1 );
    expect( dispatch ).toHaveBeenCalledWith( errorDispatch );

    normalizeSpy.mockReset();
  } );
} );
