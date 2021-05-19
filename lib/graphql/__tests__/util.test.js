import { normalizeDashboardData, setProjectTitle } from '../util';

import { mockData, mockNormalizedReturn, mockProjects } from '../__mocks__/mocks';

describe( 'normalizeDashboardData', () => {
  it( 'returns an array of project data', () => {
    const normalized = normalizeDashboardData( mockData );

    expect( normalized ).toHaveLength( 3 );
    expect( normalized ).toStrictEqual( mockNormalizedReturn );
  } );
} );

describe( 'setProjectTitle', () => {
  it( 'returns the appropriate title for a given project type', () => {
    const document = setProjectTitle( mockProjects.docProject );
    const pkg = setProjectTitle( mockProjects.packageProject );
    const video = setProjectTitle( mockProjects.videoProject );
    const unknown = setProjectTitle( mockProjects.nullProject );

    expect( document ).toEqual( 'Doc Title' );
    expect( pkg ).toEqual( 'Package Title' );
    expect( video ).toEqual( 'Video Title' );
    expect( unknown ).toEqual( '' );
  } );
} );
