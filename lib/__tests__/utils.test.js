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

  it( 'formatDateTime returns a correctly formatted date', () => {
    const { formatDateTime } = utils;

    // Eastern daylight time
    const dateArgsDT = {
      dateString: '2021-06-27T03:12:34.140Z',
      options: {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'America/New_York',
      },
    };

    const timeArgsDT = {
      ...dateArgsDT,
      options: {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'America/New_York',
      },
      timeStringOnly: true,
    };

    // Eastern standard time
    const dateArgsST = {
      ...dateArgsDT,
      dateString: '2021-02-27T03:12:34.140Z',
    };

    const timeArgsST = {
      ...dateArgsST,
      options: timeArgsDT.options,
      timeStringOnly: timeArgsDT.timeStringOnly,
    };

    // EDT
    expect( formatDateTime( dateArgsDT ) ).toEqual( 'June 26, 2021' );
    expect( formatDateTime( timeArgsDT ) ).toEqual( '11:12 PM' );
    // EST
    expect( formatDateTime( dateArgsST ) ).toEqual( 'February 26, 2021' );
    expect( formatDateTime( timeArgsST ) ).toEqual( '10:12 PM' );
  } );
} );
