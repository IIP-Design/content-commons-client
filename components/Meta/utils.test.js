import { getOgTags } from './utils';

import { mockMissingFieldsItem, mockNonVideoItem, mockVideoItem } from './mocks';

const mockUrl = 'https://mockurl.com';

describe( 'getOgTags', () => {
  it( 'returns the video-related og meta values when item has type video', () => {
    const expectedReturn = {
      'og:type': 'video.other',
      'og:url': mockUrl,
      'twitter:card': 'player',
      'og:description': 'Sample description text.',
      'og:title': 'Marek Dev',
      'og:video:url': 'https://vimeo.com/425607090',
      'twitter:player': 'https://vimeo.com/425607090',
      'twitter:player:height': '196px',
      'twitter:player:width': '350px',
    };

    expect( getOgTags( mockVideoItem, mockUrl ) ).toEqual( expectedReturn );
  } );

  it( 'omits og meta values when they are not present', () => {
    const expectedReturn = {
      'og:type': 'video.other',
      'twitter:card': 'summary',
    };

    expect( getOgTags( mockMissingFieldsItem ) ).toEqual( expectedReturn );
  } );

  it( 'does not return video-related og meta values when item is not type video', () => {
    const expectedReturn = {
      'og:type': 'article',
      'og:url': mockUrl,
      'twitter:card': 'summary',
      'og:description': 'Sample description text.',
      'og:title': 'Marek Dev',
    };

    expect( getOgTags( mockNonVideoItem, mockUrl ) ).toEqual( expectedReturn );
  } );
} );
