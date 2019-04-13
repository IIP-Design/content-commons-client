import config from 'config';
import getConfig from 'next/config';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig();
const URL = `${config.GOOGLE_LANGUAGE_DETECT_URL}?key=${publicRuntimeConfig.REACT_APP_GOOGLE_API_KEY}`;


export const languages = {
  ar: {
    display_name: 'Arabic',
    key: 'ar'
  },
  en: {
    display_name: 'English',
    key: 'en-us'
  },
  es: {
    display_name: 'Spanish',
    key: 'es-es'
  },
  fa: {
    display_name: 'Persian',
    key: 'fa-ir'
  },
  fr: {
    display_name: 'French',
    key: 'fr-fr'
  },
  id: {
    display_name: 'Bahasa Indonesia',
    key: 'id-id'
  },
  ja: {
    display_name: 'Japanese',
    key: 'ja'
  },
  ko: {
    display_name: 'Korean',
    key: 'ko-kr'
  },
  pt: {
    display_name: 'Portuguese (Brazil)',
    key: 'pt-br'
  },
  ru: {
    display_name: 'Russian',
    key: 'ru-ru'
  },
  ur: {
    display_name: 'Urdu',
    key: 'ur'
  },
  vi: {
    display_name: 'Vietnamese',
    key: 'vi'
  },
  'zh-CN': {
    display_name: 'Chinese (Simplified)',
    key: 'zh-cn'
  }
};

/**
 * Returns text direction of selected language
 * @param {string} language
 */
export const getDirection = language => ( ( [
  'ar', 'fa', 'fa-ir', 'ur'
].includes( language ) ) ? 'right' : 'left' );


const getDetections = result => {
  if ( result && result.data && result.data.data && result.data.data.detections ) {
    const { detections } = result.data.data;
    return detections.length && detections[0].length ? detections[0][0].language : null;
  }
  return null;
};

export const detectLanguage = async text => {
  const result = await axios.post( `${URL}&q=${text}` );
  const language = getDetections( result );

  if ( language ) {
    if ( !languages[language] ) {
      return null;
    }
    return {
      language: languages[language],
      direction: getDirection( language )
    };
  }
  return null;
};
