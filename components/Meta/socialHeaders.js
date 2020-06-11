/**
 * Check if content exists for a given meta property
 * If not, filters it from the meta object
 *
 * @param {Object} meta All possible meta tags
 * @returns {Object} Only those meta tags for which there is content
 */
const filterEmpty = meta => {
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

  const videoSrc = selectedLanguageUnit && selectedLanguageUnit.source && selectedLanguageUnit.source[0]
    ? selectedLanguageUnit.source[0]
    : {};
  const streamSrc = videoSrc.stream && videoSrc.stream.link ? videoSrc.stream.link : '';

  const meta = {
    'og:type': isVideo ? 'video.other' : 'article',
    'og:url': url,
    'twitter:card': isVideo ? 'player' : 'summary',
    'og:description': description,
    'og:title': title,
    'og:video:url': isVideo ? streamSrc : '',
    'twitter:player': isVideo ? streamSrc : '',
    'twitter:player:height': isVideo ? '196px' : '',
    'twitter:player:width': isVideo ? '350px' : '',
  };

  return filterEmpty( meta );
};
