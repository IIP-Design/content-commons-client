import { getFeatured, getCategories } from './utils';
import { manyCategoriesItem, oneCategoriesItem, twoCategoriesItem } from './mocks';

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
  const promise1 = new Promise( ( resolve, reject ) => { setTimeout( () => { resolve( [{ data: { hits: { hits: [] } } }] ); } ); }, 0 );
  const promise2 = new Promise( ( resolve, reject ) => { setTimeout( () => { resolve( [{ data: { hits: { hits: [] } } }] ); } ); }, 0 );

  it( '', () => {
    const promises = [promise1, promise2];
    const dispatch = jest.fn();

    getFeatured( promises, dispatch );

    expect( dispatch ).toHaveBeenCalledTimes( 1 );
  } );
} );
