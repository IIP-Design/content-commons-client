import { getModalContent } from './utils';

jest.mock( 'components/GraphicProject/GraphicProject', () => 'graphic' );
jest.mock( 'components/Post/Post', () => 'post' );
jest.mock( 'components/Video/Video', () => 'video' );

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

afterAll( () => { jest.restoreAllMocks(); } );

describe( 'getModalContent', () => {
  it( 'returns a Post components when the item type is "post"', () => {
    const item = { type: 'post' };

    const result = getModalContent( item );

    expect( result.type ).toEqual( 'post' );
    expect( result.props ).toEqual( { item } );
  } );

  it( 'returns a Video components when the item type is "video"', () => {
    const item = { type: 'video' };

    const result = getModalContent( item );

    expect( result.type ).toEqual( 'video' );
    expect( result.props ).toEqual( { item } );
  } );

  it( 'returns a GraphicProject components when the item type is "graphic"', () => {
    const item = { type: 'graphic' };

    const result = getModalContent( item );

    expect( result.type ).toEqual( 'graphic' );
    expect( result.props ).toEqual( { displayAsModal: true, item } );
  } );

  it( 'returns the no content message when item type is an unexpected type', () => {
    const item = { type: 'test' };

    const result = getModalContent( item );

    expect( result.type ).toEqual( 'div' );
    expect( result.props.children ).toEqual( 'No content currently available' );
  } );

  it( 'returns the no content message when no item is provided', () => {
    const result = getModalContent();

    expect( result.type ).toEqual( 'div' );
    expect( result.props.children ).toEqual( 'No content currently available' );
  } );
} );
