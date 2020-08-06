import iconPost from 'static/icons/icon_32px_post.png';
import iconCourse from 'static/icons/icon_32px_course.png';
import iconAudio from 'static/icons/icon_32px_audio.png';
import iconVideoCamera from 'static/icons/icon_32px_videoCamera.png';
import iconImage from 'static/icons/icon_32px_image.png';

import thumbnailPost from 'static/images/thumbnail_post.jpg';
import thumbnailCourse from 'static/images/thumbnail_course.jpg';
import thumbnailAudio from 'static/images/thumbnail_audio.jpg';
import thumbnailVideo from 'static/images/thumbnail_video.jpg';
import thumbnailImage from 'static/images/thumbnail_image.jpg';

import logoYali from 'static/images/logo_yali.svg';
import logoYlai from 'static/images/logo_ylai.svg';
import logoShareamerica from 'static/images/logo_shareamerica.svg';
import logoGEC from 'static/images/logo_gec.svg';
import logoVOA from 'static/images/logo_voa.png';
import logoDOSSeal from 'static/images/dos_seal.svg';

import { contentRegExp, getHasSomeNonCleanVideos, maybeGetUrlToProdS3 } from 'lib/utils';

// import store from '../redux/store';

const logos = [
  { name: 'yali', logo: logoYali },
  { name: 'ylai', logo: logoYlai },
  { name: 'share', logo: logoShareamerica },
  { name: 'global engagement center', logo: logoGEC },
  { name: 'voa editorials', logo: logoVOA },
  { name: 'press office', logo: logoDOSSeal },
];

/**
 * Fetches the logo representing the content owner
 * @param {string} site Original source site
 * @param {string} owner Team that owns the content
 * @param {string} type Content type
 */
const getLogo = ( site, owner, type ) => {
  const siteOwner
    = type === 'video'
    || type === 'document'
    || type === 'package'
    || contentRegExp( site )
      ? owner
      : site;

  const siteLogo = logos.filter( logo => siteOwner.toLowerCase().indexOf( logo.name ) > -1 );

  if ( siteLogo[0] && siteLogo[0].logo ) {
    return siteLogo[0].logo;
  }

  return '';
};

/**
 * Fetches the appropriate icon based on the provided content type
 * @param {string} type Content type
 */
const getIcon = type => {
  let icon = '';

  switch ( type ) {
    case 'course':
      icon = iconCourse;
      break;
    case 'audio':
      icon = iconAudio;
      break;
    case 'video':
      icon = iconVideoCamera;
      break;
    case 'graphic':
    case 'image':
      icon = iconImage;
      break;
    default:
      icon = iconPost;
  }

  return icon;
};

/**
 * Fetches the appropriate placeholder based on the provided content type
 * @param {string} type Content type
 */
const getDefaultThumbnail = type => {
  let thumbnail = '';

  switch ( type ) {
    case 'course':
      thumbnail = thumbnailCourse;
      break;
    case 'podcast':
      thumbnail = thumbnailAudio;
      break;
    case 'video':
      thumbnail = thumbnailVideo;
      break;
    case 'graphic':
    case 'image':
      thumbnail = thumbnailImage;
      break;
    case 'document':
    default:
      thumbnail = thumbnailPost;
  }

  return thumbnail;
};

const getThumbnail = ( source, languageUnit = null ) => {
  const { thumbnail } = languageUnit && languageUnit.thumbnail ? languageUnit : source;
  const image = source.featured_image;
  const tn = thumbnail && thumbnail.sizes ? thumbnail.sizes : thumbnail;
  let thumbUrl = null;

  if ( tn ) {
    if ( tn.medium && tn.medium.url ) {
      thumbUrl = tn.medium.url;
    } else if ( tn.small && tn.small.url ) {
      thumbUrl = tn.small.url;
    } else if ( tn.large && tn.large.url ) {
      thumbUrl = tn.large.url;
    } else if ( tn.full && tn.full.url ) {
      thumbUrl = tn.full.url;
    }
  } else if ( image && image.sizes && image.sizes.medium ) {
    thumbUrl = image.sizes.medium.url;
  }
  if ( thumbUrl ) {
    thumbUrl = maybeGetUrlToProdS3( thumbUrl );
  }

  return thumbUrl;
};

const getThumbnailMeta = source => {
  const thumbnail = ( source || {} ).thumbnail || {};

  const imageMeta = {
    alt: thumbnail.alt ? thumbnail.alt : ' ',
    caption: thumbnail.caption ? thumbnail.caption : '',
  };

  return imageMeta;
};

const getThumbnailFromVideo = source => {
  let thumbnail = '';

  const vidSrc = source[0];

  if ( vidSrc && vidSrc.stream && vidSrc.stream.thumbnail ) {
    // eslint-disable-next-line prefer-destructuring
    thumbnail = vidSrc.stream.thumbnail;
  }

  return thumbnail || getDefaultThumbnail( 'video' );
};

const getThumbnailFromImage = source => {
  let thumbnail = '';

  const imgSrc = source[0];

  if ( imgSrc ) {
    switch ( imgSrc.filetype ) {
      case 'pdf':
        thumbnail = getDefaultThumbnail( 'image' );
        break;
      default:
        thumbnail = imgSrc.src;
    }
  }

  return thumbnail || getDefaultThumbnail( 'image' );
};

const getAuthor = author => {
  if ( !author ) return '';

  return author.name || author;
};

const getLocaleKey = () => 'en-us';
// const getLocaleKey = locale => 'en-us';
// return store.getState().global.languages.default.key;

// send in locale to fetch applicable lang data props?
const populateVideoItem = ( source, language ) => {
  // const { key } = store.getState().language.currentLanguage;
  // const key = getLocaleKey( language );
  const units = source.unit.map( unit => {
    if ( unit.thumbnail ) {
      unit.thumbnail = getThumbnail( source, unit );
    }

    return unit;
  } );
  // const languageUnit = units.find( unit => unit.language.locale.toLowerCase() === language.toLowerCase() );
  const languageUnit = units.find( unit => {
    const hasSomeNonClean = getHasSomeNonCleanVideos( unit );

    return hasSomeNonClean;
  } );

  let thumbnail = null;

  if ( languageUnit && languageUnit.thumbnail ) {
    ( { thumbnail } = languageUnit );
  } else if ( source.thumbnail ) {
    thumbnail = getThumbnail( source, null );
  }

  let obj = {};

  if ( languageUnit ) {
    obj = {
      title: languageUnit.title || '[TITLE]',
      description: languageUnit.desc || '',
      thumbnail: thumbnail || getThumbnailFromVideo( languageUnit.source ),
      categories: languageUnit.categories || [],
      tags: languageUnit.tags || [],
      duration: source.duration,
      supportFiles: source.supportFiles || [],
      units,
      selectedLanguageUnit: languageUnit,
    };
  } else {
    // this may not be needed
    obj = {
      title: '[TITLE]',
      description: '',
      thumbnail: getDefaultThumbnail( 'video' ),
      categories: [],
      tags: [],
      duration: '',
      units: [],
      supportFiles: [],
    };
  }

  return obj;
};

const populateImageItem = ( source, language ) => {
  const key = getLocaleKey( language );
  const units = source.unit;
  const languageUnit = units.find( unit => unit.language.locale.toLowerCase() === key.toLowerCase() );
  const thumbnail = languageUnit && getThumbnailFromImage( languageUnit.images );
  let obj = {};

  if ( languageUnit ) {
    obj = {
      title: languageUnit.title || '[TITLE]',
      description: languageUnit.desc || '',
      internalDescription: languageUnit.internal_desc || '',
      thumbnail: thumbnail || getDefaultThumbnail( 'image' ),
      categories: languageUnit.categories || [],
      tags: languageUnit.tags || [],
      units,
      selectedLanguageUnit: languageUnit,
    };
  } else {
    // this may not be needed
    obj = {
      title: '[TITLE]',
      description: '',
      internalDescription: '',
      thumbnail: getDefaultThumbnail( 'image' ),
      categories: [],
      tags: [],
      units: [],
    };
  }

  return obj;
};

const populateDocumentItem = source => {
  const obj = {
    title: source.title,
    content: source.content,
    excerpt: source.excerpt,
    thumbnail: getDefaultThumbnail( source.type ),
    tags: source.tags || [],
    language: source.language,
    documentUrl: source.url,
    documentUse: source.use,
    visibility: source.visibility,
  };

  return obj;
};

const populatePackageItem = source => {
  const obj = {
    title: source.title,
    documents: source.items,
  };

  return obj;
};

const populateGraphicItem = source => {
  const obj = {
    projectType: source.projectType,
    title: source.title,
    alt: source.alt,
    descPublic: source.descPublic,
    descInternal: source.descInternal,
    copyright: source.copyright,
    thumbnail: source?.images?.[0]?.url || getDefaultThumbnail( 'image' ),
    images: source.images,
    supportFiles: source.supportFiles,
    categories: source.categories,
  };

  return obj;
};

const populateItem = source => {
  const obj = {
    title: source.title,
    description: source.excerpt,
    content: source.content,
    thumbnail: getThumbnail( source ) || getDefaultThumbnail( source.type ),
    thumbnailMeta: getThumbnailMeta( source ) || {},
    categories: source.categories || [],
    language: source.language,
    languages: source.languages || [],
  };

  return obj;
};

const getTypeSpecObj = ( source, language ) => {
  let obj;

  switch ( source.type ) {
    case 'video':
      obj = populateVideoItem( source, language );
      break;
    case 'image':
      obj = populateImageItem( source, language );
      break;
    case 'document':
      obj = populateDocumentItem( source, language );
      break;
    case 'package':
      obj = populatePackageItem( source );
      break;
    case 'graphic':
      obj = populateGraphicItem( source );
      break;
    case 'post':
    case 'course':
      obj = populateItem( source );
      break;

    default:
      obj = {};
  }

  return obj;
};

export const normalizeItem = ( item, language ) => {
  const source = item._source;

  const obj = {
    id: source.post_id ? source.post_id : source.id,
    indexId: item._id,
    site: source.site,
    logo: getLogo( source.site, source.owner, source.type ),
    sourcelink: `https://${source.site}`,
    type: source.type,
    icon: getIcon( source.type ),
    author: getAuthor( source.author ), // make video obj  w/id & name to be consistent??
    owner: source.owner,
    link: source.link || '',
    published: source.published,
    modified: source.modified,
    visibility: source.visibility,
  };

  const typeSpecificObj = getTypeSpecObj( source, language );

  return { ...obj, ...typeSpecificObj };
};

/**
 * Convenience method to fetch data
 * @param {object} response elastic search response
 */
export const getDataFromHits = response => {
  if ( response.hits && response.hits.hits ) {
    return response.hits.hits;
  }

  return null;
};
