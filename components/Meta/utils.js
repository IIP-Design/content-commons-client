/**
 * Check if content exists for a given meta property
 * If not, filters it from the meta object
 *
 * @param {Object} meta All possible meta tags
 * @returns {Object} Only those meta tags for which there is content
 */
const _filterEmpty = meta => {
  const filteredMeta = {};
  const metaArr = Object.entries( meta );

  metaArr.forEach( item => {
    if ( item[1] ) {
      const property = item[0];
      const value = item[1];

      filteredMeta[property] = value;
    }
  } );

  return filteredMeta;
};

/**
 * Converts the content item object into a metavalues array using the checkAndPush method
 *
 * @param {object} item Object of metadata for a given content item
 * @param {string} url The URL of the page to be rendered
 * @returns {array} Array of { property: content } key pairs
 */
export const getOgTags = ( item, url ) => {
  const {
    selectedLanguageUnit,
    title,
    type,
  } = item;

  const isVideo = type && type === 'video';

  /* TEMP vars for Document use case */
  const trimContent = item.content && item.content.rawText && `${item.content.rawText.substring( 0, 152 )}...`;
  const description = item.description || trimContent;

  const stream = selectedLanguageUnit?.source?.[0]?.stream ? selectedLanguageUnit.source[0].stream : {};
  const streamSrc = stream.link ? stream.link : '';

  const usePlayer = isVideo && streamSrc;

  const meta = {
    'og:type': isVideo ? 'video.other' : 'article',
    'og:url': url,
    'twitter:card': usePlayer ? 'player' : 'summary',
    'og:description': description,
    'og:title': title,
    'og:video:url': usePlayer ? streamSrc : '',
    'twitter:player': usePlayer ? streamSrc : '',
    'twitter:player:height': usePlayer ? '196px' : '',
    'twitter:player:width': usePlayer ? '350px' : '',
  };

  return _filterEmpty( meta );
};
