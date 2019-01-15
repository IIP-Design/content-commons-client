import iconPost from '../../static/icons/icon_32px_post.png';
import iconCourse from '../../static/icons/icon_32px_course.png';
import iconAudio from '../../static/icons/icon_32px_audio.png';
import iconVideo from '../../static/icons/icon_32px_video.png';

import thumbnailPost from '../../static/images/thumbnail_post.jpg';
import thumbnailCourse from '../../static/images/thumbnail_course.jpg';
import thumbnailAudio from '../../static/images/thumbnail_audio.jpg';
import thumbnailVideo from '../../static/images/thumbnail_video.jpg';

import logoYali from '../../static/images/logo_yali.svg';
import logoYlai from '../../static/images/logo_ylai.svg';
import logoShareamerica from '../../static/images/logo_shareamerica.svg';

import store from '../redux/store';


const logos = [
  { name: 'yali', logo: logoYali },
  { name: 'ylai', logo: logoYlai },
  { name: 'share', logo: logoShareamerica }
];

const getLogo = site => {
  const siteLogo = logos.filter( logo => site.indexOf( logo.name ) > -1 );
  if ( siteLogo[0] && siteLogo[0].logo ) {
    return siteLogo[0].logo;
  }
  return '';
};

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
      icon = iconVideo;
      break;
    default:
      icon = iconPost;
  }

  return icon;
};

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
    default:
      thumbnail = thumbnailPost;
  }

  return thumbnail;
};

const getThumbnail = source => {
  const { thumbnail } = source;
  const image = source.featured_image;
  const tn = ( thumbnail && thumbnail.sizes ) ? thumbnail.sizes : thumbnail;

  if ( tn ) {
    if ( tn.medium && tn.medium.url ) {
      return tn.medium.url;
    }

    if ( tn.small && tn.small.url ) {
      return tn.small.url;
    }

    if ( tn.large && tn.large.url ) {
      return tn.large.url;
    }

    if ( tn.full && tn.full.url ) {
      return tn.full.url;
    }
  } else if ( image && image.sizes && image.sizes.medium ) {
    return image.sizes.medium.url;
  }

  return null;
};

const getThumbnailMeta = source => {
  const thumbnail = ( ( source || {} ).thumbnail || {} );

  const imageMeta = {
    alt: ( thumbnail.alt ? thumbnail.alt : ' ' ),
    caption: ( thumbnail.caption ? thumbnail.caption : '' )
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

const getAuthor = author => {
  if ( !author ) return '';
  return author.name || author;
};

const getLocaleKey = locale => 'en-us'
  // return store.getState().global.languages.default.key;
;

// send in locale to fetch applicable lang data props?
const populateVideoItem = ( source, language ) => {
  // const { key } = store.getState().language.currentLanguage;
  const key = getLocaleKey( language );
  const thumbnail = getThumbnail( source );
  const units = source.unit;
  const languageUnit = units.find( unit => unit.language.locale.toLowerCase() === key.toLowerCase() );
  let obj = {};

  if ( languageUnit ) {
    obj = {
      title: languageUnit.title || '[TITLE]',
      description: languageUnit.desc || '',
      thumbnail: thumbnail || getThumbnailFromVideo( languageUnit.source ),
      categories: languageUnit.categories || [],
      tags: languageUnit.tags || [],
      duration: source.duration,
      units,
      selectedLanguageUnit: languageUnit
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
      units: []
    };
  }

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
    languages: source.languages || []
  };

  return obj;
};

const getTypeSpecObj = ( source, language ) => {
  let obj;

  switch ( source.type ) {
    case 'video':
      obj = populateVideoItem( source, language );
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
    logo: getLogo( source.site ),
    sourcelink: `https://${source.site}`,
    type: source.type,
    icon: getIcon( source.type ),
    author: getAuthor( source.author ), // make video obj  w/id & name to be consistent??
    owner: source.owner,
    link: source.link || '',
    published: source.published,
    modified: source.modified
  };

  const typeSpecificObj = getTypeSpecObj( source, language );

  return { ...obj, ...typeSpecificObj };
};
