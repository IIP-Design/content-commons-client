import * as utils from '../utils';

describe( 'utility function', () => {
  it( 'getFileExt returns the file extension', () => {
    const { getFileExt } = utils;
    const params = [
      'file name.jpg',
      'file-name.jpg',
      'file_name.jpg',
      'file.name.jpg',
      'file name',
      5,
      undefined,
      true,
      null,
      {},
      [],
      () => {},
      Symbol( 'file name.jpg' ),
      NaN,
    ];

    params.forEach( param => {
      const extWithPeriod = getFileExt( param );
      const extNoPeriod = getFileExt( param, false );

      if ( typeof param === 'string' && param.lastIndexOf( '.' ) !== -1 ) {
        expect( extWithPeriod ).toEqual( '.jpg' );
        expect( extNoPeriod ).toEqual( 'jpg' );
      } else {
        expect( extWithPeriod ).toEqual( '' );
        expect( extNoPeriod ).toEqual( '' );
      }
    } );
  } );

  it( 'getFileNameNoExt returns the file name with no extension', () => {
    const { getFileNameNoExt } = utils;
    const params = [
      'file name.jpg',
      'file-name.jpg',
      'file_name.jpg',
      'file.name.jpg',
      'file name',
      5,
      undefined,
      true,
      null,
      {},
      [],
      () => {},
      Symbol( 'file name.jpg' ),
      NaN,
    ];

    params.forEach( param => {
      const filename = getFileNameNoExt( param );

      if ( typeof param === 'string' ) {
        const index = param.lastIndexOf( '.' );
        const cutoff = index !== -1 ? index : param.length;

        expect( filename ).toEqual( param.slice( 0, cutoff ) );
      } else {
        expect( filename ).toEqual( '' );
      }
    } );
  } );

  it( 'getFileNameFromUrl returns the file name from a url', () => {
    const { getFileNameFromUrl } = utils;
    const filename = 'sample.vtt';

    const params = [
      `https://bucket.com/2020/06/commons.america.gov_ckbgvji0f01br0720bxfpgglv/${filename}`,
      `https://bucket.com/2020/06/commons.america.gov_ckbgvji0f01br0720bxfpgglv/${filename}?query=something&filter=somethingelse`,
      '',
      5,
      undefined,
      true,
      null,
      {},
      [],
      () => {},
      Symbol( filename ),
      NaN,
    ];

    params.forEach( param => {
      const derivedFileName = getFileNameFromUrl( param );

      if ( typeof param === 'string' && param ) {
        expect( derivedFileName ).toEqual( filename );
      } else {
        expect( derivedFileName ).toEqual( '' );
      }
    } );
  } );
} );
