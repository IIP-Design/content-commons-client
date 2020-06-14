import { isObject } from 'lib/utils';
import { getDataFromHits, normalizeItem } from '../parser';
import {
  imageJPG, imageNoEnglishJPG, imagePDF, post, response, video,
} from '../mocks';

jest.mock(
  'static/images/thumbnail_image.jpg',
  () => 'thumbnailImage',
);

describe( 'getDataFromHits', () => {
  it( 'returns elastic search response', () => {
    const data = getDataFromHits( response );

    expect( data ).toEqual( response.hits.hits );
  } );

  it( 'returns null if !response', () => {
    const data = getDataFromHits( {} );

    expect( data ).toEqual( null );
  } );

  it( 'returns null if !response.hits', () => {
    const data = getDataFromHits( { hits: {} } );

    expect( data ).toEqual( null );
  } );
} );

describe( 'normalizeItem', () => {
  it( 'returns a normalized item (post) object', () => {
    const language = 'en-us';
    const item = normalizeItem( post, language );
    const {
      title, excerpt, content, categories, languages, thumbnail,
    } = post._source;
    const { alt, caption, sizes } = thumbnail;
    // keys for post type
    const keys = [
      'title',
      'description',
      'content',
      'thumbnail',
      'thumbnailMeta',
      'categories',
      'language',
      'languages',
    ];

    expect( isObject( item ) ).toEqual( true );
    expect( item.type ).toEqual( 'post' );
    keys.forEach( key => {
      expect( Object.keys( item ).includes( key ) ).toEqual( true );
      switch ( key ) {
        case 'title':
          expect( item[key] ).toEqual( title );
          break;
        case 'description':
          expect( item[key] ).toEqual( excerpt );
          break;
        case 'content':
          expect( item[key] ).toEqual( content );
          break;
        case 'thumbnail':
          expect( item[key] ).toEqual( sizes.medium.url );
          break;
        case 'thumbnailMeta':
          expect( item[key] ).toEqual( { alt, caption } || {} );
          break;
        case 'categories':
          expect( item[key] ).toEqual( categories || [] );
          break;
        case 'language':
          expect( item[key] ).toEqual( post._source.language );
          break;
        case 'languages':
          expect( item[key] ).toEqual( languages || [] );
          break;
        default:
          break;
      }
    } );
  } );

  it( 'returns a normalized item (video) object for a selected language', () => {
    const language = 'fr-fr';
    const item = normalizeItem( video, language );
    const languages = video._source.unit.map( u => u.language.locale );
    const {
      title, desc, categories, tags, supportFiles, source,
    } = video._source.unit[3];
    // keys for video type
    const keys = [
      'title',
      'description',
      'thumbnail',
      'categories',
      'tags',
      'duration',
      'supportFiles',
      'units',
      'selectedLanguageUnit',
    ];

    expect( languages.includes( language ) ).toEqual( true );
    expect( isObject( item ) ).toEqual( true );
    expect( item.type ).toEqual( 'video' );
    keys.forEach( key => {
      expect( Object.keys( item ).includes( key ) ).toEqual( true );
      switch ( key ) {
        case 'title':
          expect( item[key] ).toEqual( title );
          break;
        case 'description':
          expect( item[key] ).toEqual( desc );
          break;
        // case 'thumbnail':
        //   expect( item[key] ).toEqual( source[0].stream.thumbnail );
        //   break;
        case 'categories':
          expect( item[key] ).toEqual( categories || [] );
          break;
        case 'tags':
          expect( item[key] ).toEqual( tags || [] );
          break;
        case 'duration':
          expect( item[key] ).toEqual( video._source.duration );
          break;
        case 'supportFiles':
          expect( item[key] ).toEqual( supportFiles || [] );
          break;
        case 'units':
          expect( item[key] ).toEqual( video._source.unit );
          break;
        case 'selectedLanguageUnit':
          expect( item[key] ).toEqual( video._source.unit[3] );
          break;
        default:
          break;
      }
    } );
  } );

  it( 'returns a normalized item (video) object for an unprovided language', () => {
    // id-id Bahasa Indonesia
    const language = 'id-id';
    const item = normalizeItem( video, language );
    const languages = video._source.unit.map( u => u.language.locale );
    const defaultThumb = 'thumbnailImage';
    // keys for video type
    const keys = [
      'title',
      'description',
      'thumbnail',
      'categories',
      'tags',
      'duration',
      'units',
      'supportFiles',
    ];

    expect( languages.includes( language ) ).toEqual( false );
    expect( isObject( item ) ).toEqual( true );
    expect( item.type ).toEqual( 'video' );
    keys.forEach( key => {
      expect( Object.keys( item ).includes( key ) ).toEqual( true );
      switch ( key ) {
        case 'title':
          expect( item[key] ).toEqual( '[TITLE]' );
          break;
        case 'description':
        case 'duration':
          expect( item[key] ).toEqual( '' );
          break;
        case 'categories':
        case 'tags':
        case 'units':
        case 'supportFiles':
          expect( item[key] ).toEqual( [] );
          break;
        case 'thumbnail':
          expect( item[key] ).toEqual( defaultThumb );
          break;
        default:
          break;
      }
    } );
  } );

  it( 'returns a normalized item (jpg image) object for en-us', () => {
    const language = 'en-us';
    const image = imageJPG;
    const item = normalizeItem( image, language );
    const languages = image._source.unit.map( u => u.language.locale );
    const {
      title, images, categories, tags, desc,
    } = image._source.unit[0];
    // keys for image type
    const keys = [
      'title',
      'description',
      'internalDescription',
      'thumbnail',
      'categories',
      'tags',
      'units',
      'selectedLanguageUnit',
    ];

    expect( languages.includes( language ) ).toEqual( true );
    expect( isObject( item ) ).toEqual( true );
    expect( item.type ).toEqual( 'image' );
    keys.forEach( key => {
      expect( Object.keys( item ).includes( key ) ).toEqual( true );
      switch ( key ) {
        case 'title':
          expect( item[key] ).toEqual( title );
          break;
        case 'description':
          expect( item[key] ).toEqual( desc );
          break;
        case 'thumbnail':
          expect( item[key] ).toEqual( images[0].src );
          break;
        case 'internalDescription':
          expect( item[key] ).toEqual( '' );
          break;
        case 'categories':
          expect( item[key] ).toEqual( categories || [] );
          break;
        case 'tags':
          expect( item[key] ).toEqual( tags || [] );
          break;
        case 'units':
          expect( item[key] ).toEqual( image._source.unit );
          break;
        case 'selectedLanguageUnit':
          expect( item[key] ).toEqual( image._source.unit[0] );
          break;
        default:
          break;
      }
    } );
  } );

  it( 'returns a normalized item (jpg image) object if there are no English units', () => {
    const language = 'en-us';
    const image = imageNoEnglishJPG;
    const item = normalizeItem( image, language );
    const languages = image._source.unit.map( u => u.language.locale );
    const defaultThumb = 'thumbnailImage';
    // keys for image type
    const keys = [
      'title',
      'description',
      'internalDescription',
      'thumbnail',
      'categories',
      'tags',
      'units',
    ];

    expect( languages.includes( language ) ).toEqual( false );
    expect( isObject( item ) ).toEqual( true );
    expect( item.type ).toEqual( 'image' );
    keys.forEach( key => {
      expect( Object.keys( item ).includes( key ) ).toEqual( true );
      switch ( key ) {
        case 'title':
          expect( item[key] ).toEqual( '[TITLE]' );
          break;
        case 'description':
        case 'internalDescription':
          expect( item[key] ).toEqual( '' );
          break;
        case 'categories':
        case 'tags':
        case 'units':
          expect( item[key] ).toEqual( [] );
          break;
        case 'thumbnail':
          expect( item[key] ).toEqual( defaultThumb );
          break;
        default:
          break;
      }
    } );
  } );

  it( 'returns a normalized item (pdf image) object for en-us', () => {
    const language = 'en-us';
    const image = imagePDF;
    const item = normalizeItem( image, language );
    const languages = image._source.unit.map( u => u.language.locale );
    const {
      title, categories, tags, desc,
    } = image._source.unit[0];
    const defaultThumb = 'thumbnailImage';
    // keys for image type
    const keys = [
      'title',
      'description',
      'internalDescription',
      'thumbnail',
      'categories',
      'tags',
      'units',
      'selectedLanguageUnit',
    ];

    expect( languages.includes( language ) ).toEqual( true );
    expect( isObject( item ) ).toEqual( true );
    expect( item.type ).toEqual( 'image' );
    keys.forEach( key => {
      expect( Object.keys( item ).includes( key ) ).toEqual( true );
      switch ( key ) {
        case 'title':
          expect( item[key] ).toEqual( title );
          break;
        case 'description':
          expect( item[key] ).toEqual( desc );
          break;
        case 'internalDescription':
          expect( item[key] ).toEqual( '' );
          break;
        case 'categories':
          expect( item[key] ).toEqual( categories || [] );
          break;
        case 'tags':
          expect( item[key] ).toEqual( tags || [] );
          break;
        case 'units':
          expect( item[key] ).toEqual( image._source.unit );
          break;
        case 'thumbnail':
          expect( item[key] ).toEqual( defaultThumb );
          break;
        default:
          break;
      }
    } );
  } );
} );
