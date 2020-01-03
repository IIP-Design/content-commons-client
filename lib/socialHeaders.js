/**
 * Check if content exists for a given property
 * If so, it is pushed to a properties array
 *
 * @param {object} array Target array into which values are added
 * @param {string} property Property name
 * @param {string} content Property content
 */
const checkAndPush = ( array, property, content ) => {
  if ( content ) {
    const newMeta = {
      property,
      content
    };

    array.push( newMeta );
  }
};

/**
 * Converts the content item object into a metavalues array using the checkAndPush method
 *
 * @param {object} item Object of metadata for a given content item
 * @param {string} url The URL of the page to be rendered
 * @returns {array} Array of { property: content } key pairs
 */
export const populateMetaArray = ( item, url ) => {
  const {
    // description,
    thumbnail,
    selectedLanguageUnit,
    title,
    type
  } = item;

  /* TEMP vars for Document use case */
  const trimContent = item.content && `${item.content.rawText.substring( 0, 152 )}...`;
  const description = item.description || trimContent;

  const videoSrc = ( selectedLanguageUnit && selectedLanguageUnit.source && selectedLanguageUnit.source[0] )
    ? selectedLanguageUnit.source[0]
    : {};
  const streamSrc = ( videoSrc.stream && videoSrc.stream.link ) ? videoSrc.stream.link : '';

  // Initialize metavalue array with universal properties
  const metaArr = [
    {
      property: 'og:type',
      content: ( type && type === 'video' ) ? 'video.other' : 'article'
    },
    {
      property: 'og:url',
      content: url
    },
    {
      property: 'twitter:card',
      content: ( type && type === 'video' ) ? 'player' : 'summary'
    }
  ];

  // Temporary array of optional meta values
  const propsArray = [
    {
      property: 'og:description',
      content: description
    },
    {
      property: 'og:image',
      content: thumbnail
    },
    {
      property: 'og:title',
      content: title
    },
    {
      property: 'og:video:url',
      content: streamSrc
    },
    {
      property: 'twitter:player',
      content: streamSrc
    },
    {
      property: 'twitter:player:height',
      content: ( type && type === 'video' ) ? '196px' : ''
    },
    {
      property: 'twitter:player:width',
      content: ( type && type === 'video' ) ? '350px' : ''
    }
  ];

  // Checks for desired meta tags against items
  propsArray.forEach( propPair => {
    checkAndPush( metaArr, propPair.property, propPair.content );
  } );

  return metaArr;
};
