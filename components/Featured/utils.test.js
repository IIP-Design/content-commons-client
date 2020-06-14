import { getFeatured, getCategories, loadPostTypes } from './utils';
import { manyCategoriesItem, mockPromises, oneCategoriesItem, twoCategoriesItem } from './mocks';
import * as api from 'lib/elastic/api';
import * as parser from 'lib/elastic/parser';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

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

  it( 'sends a "LOAD_FEATURED_SUCCESS" dispatch with expected priorities and recents', async () => {
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

  it( 'sends a "LOAD_FEATURED_FAILED" dispatch when a promise returns an error', async () => {
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

describe( 'loadPostTypes', () => {
  const mockedResponse = {
    aggregations: {
      postType: { buckets: [
        { key: 'document' },
        { key: 'package' },
        { key: 'video' },
        { key: 'post' },
        { key: 'graphic' },
      ] },
    },
  };

  const mockUser = { id: '1234', firstName: 'Mr.', lastName: 'Robot' };

  const mockPendingDispatch = { type: 'LOAD_POST_TYPES_PENDING' };
  const mockErrorDispatch = { type: 'LOAD_POST_TYPES_FAILED' };
  const mockSuccessDispatch = {
    type: 'LOAD_POST_TYPES_SUCCESS',
    payload: [
      { key: 'document', display_name: 'Press Releases and Guidance' },
      { key: 'video', display_name: 'Video' },
      { key: 'post', display_name: 'Article' },
      { key: 'graphic', display_name: 'Graphic' },
    ],
  };
  const mockEmptyDispatch = {
    type: 'LOAD_POST_TYPES_SUCCESS',
    payload: [],
  };

  it( 'sends a "LOAD_POST_TYPES_PENDING" dispatch when the function is run followed by "LOAD_POST_TYPES_SUCCESS" dispatch with the expected payload when postTypeAggRequest returns a response', async () => {
    const postTypeAggRequestSpy = jest.spyOn( api, 'postTypeAggRequest' )
      .mockResolvedValue( mockedResponse );

    const dispatch = jest.fn();

    await loadPostTypes( dispatch, mockUser );

    expect( dispatch ).toHaveBeenCalledTimes( 2 );
    expect( dispatch ).toHaveBeenNthCalledWith( 1, mockPendingDispatch );
    expect( dispatch ).toHaveBeenNthCalledWith( 2, mockSuccessDispatch );
    expect( postTypeAggRequestSpy ).toHaveBeenCalledTimes( 1 );

    postTypeAggRequestSpy.mockReset();
  } );

  it( 'sends a "LOAD_POST_TYPES_SUCCESS" dispatch with an empty array when postTypeAggRequest returns a response without buckets', async () => {
    const postTypeAggRequestSpy = jest.spyOn( api, 'postTypeAggRequest' )
      .mockResolvedValue( {} );

    const dispatch = jest.fn();

    await loadPostTypes( dispatch, mockUser );

    expect( dispatch ).toHaveBeenCalledTimes( 2 );
    expect( dispatch ).toHaveBeenNthCalledWith( 1, mockPendingDispatch );
    expect( dispatch ).toHaveBeenNthCalledWith( 2, mockEmptyDispatch );
    expect( postTypeAggRequestSpy ).toHaveBeenCalledTimes( 1 );

    postTypeAggRequestSpy.mockReset();
  } );

  it( 'sends a "LOAD_POST_TYPES_FAILED" dispatch when postTypeAggRequest returns an error', async () => {
    const postTypeAggRequestSpy = jest.spyOn( api, 'postTypeAggRequest' )
      .mockRejectedValue( {} );

    const dispatch = jest.fn();

    await loadPostTypes( dispatch, mockUser );

    expect( dispatch ).toHaveBeenCalledTimes( 2 );
    expect( dispatch ).toHaveBeenNthCalledWith( 1, mockPendingDispatch );
    expect( dispatch ).toHaveBeenNthCalledWith( 2, mockErrorDispatch );
    expect( postTypeAggRequestSpy ).toHaveBeenCalledTimes( 1 );

    postTypeAggRequestSpy.mockReset();
  } );
} );
