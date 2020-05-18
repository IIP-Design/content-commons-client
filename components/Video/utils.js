import axios from 'axios';
import getConfig from 'next/config';

import config from 'config';
import { getYouTubeId } from 'lib/utils';

const { publicRuntimeConfig } = getConfig();

/**
   * Some videos have 2 formats: clean (no burned in captions) and
   * with captions (video has captions burned into file). Check see what format to return
   * Note: The burnedInCaptions property is coming in as 'true' and 'false' strings. Need to coerce
   * in spots to ensure valid comparison.  Going forward, try to avoid 'true' and 'false' strings
   *
   * @param {object} unit currently selected language
   * @return true (format to load video with captions) or false (clean file)
   */
export const getCaptions = unit => {
  if ( unit && unit.source && unit.source[0] ) {
    return unit.source[0].burnedInCaptions === 'true'; // coerce to a boolean
  }

  return false;
};

export const getVideoTranscript = unit => {
  if ( unit ) {
    if ( unit.transcript && unit.transcript.text ) {
      return unit.transcript.text;
    }
  } else {
    return '';
  }
};

export const getLanguage = unit => {
  if ( unit && unit.language ) {
    return unit.language;
  }

  return { display_name: 'English', locale: 'en-us', text_direction: 'ltr' };
};

/**
   * Executes YouTube API call to verify reachable, valid YouTube url
   *
   * @param {string} id YouTube id
   * @return Promise
   */
export const checkForValidYouTube = async ytid => {
  if ( config.YOUTUBE_API_URL && publicRuntimeConfig.REACT_APP_YOUTUBE_API_KEY ) {
    const url = `${config.YOUTUBE_API_URL}?part=id&id=${ytid}&key=${publicRuntimeConfig.REACT_APP_YOUTUBE_API_KEY}`;

    try {
      const res = await axios.get( url );

      if ( res.data && res.data.pageInfo && res.data.pageInfo.totalResults > 0 ) return res;
    } catch ( err ) {
      return Promise.resolve( null );
    }
  }

  return Promise.resolve( null );
};

/**
   * Fetches a video props from a valid YouTube link by:
   * 1. Checks for available stream object in selected language
   * 2. Fetches YouTube id from available stream object
   * 3. If valid YouTube id is returned, checks to see if url is reachable
   * 4. If reachable url, return props else return null
   *
   * @param {object} unit currently selected language
   * @return Resolved Promise with video props or null
   */
export const getYouTube = async ( u, captions ) => {
  if ( u && Array.isArray( u.source ) ) {
    const source = u.source.find( caption => caption.burnedInCaptions === 'true' === captions );

    if ( source && source.streamUrl ) {
      const streamObj = source.streamUrl.find( stream => stream.site === 'youtube' );

      if ( streamObj && streamObj.site === 'youtube' && streamObj.url ) {
        const youtubeUrl = streamObj.url;
        const videoId = getYouTubeId( youtubeUrl );

        if ( videoId ) {
          const res = await checkForValidYouTube( videoId );

          if ( res ) {
            // use youtube embed format to avoid x-origin issues
            return Promise.resolve( { videoId, shareLink: `https://www.youtube.com/embed/${videoId}` } );
          }
        }
      }
    }
  }

  return Promise.resolve( null );
};

/**
   * Search selected language and return Vimeo id it exists
   *
   * @param {object} unit currently selected language
   * @return vimeo id
   */
export const getVimeo = ( unit, captions ) => {
  if ( unit && Array.isArray( unit.source ) ) {
    const source = unit.source.find( caption => caption.burnedInCaptions === 'true' === captions );

    if ( source && source.streamUrl ) {
      const streamObj = source.streamUrl.find( stream => stream.site === 'vimeo' );

      if ( streamObj && streamObj.site === 'vimeo' && streamObj.url ) {
        return {
          videoId: streamObj.uid,
          shareLink: streamObj.url,
        };
      }
    }
    if ( source && source.stream && source.stream.site === 'vimeo' && source.stream.url ) {
      return {
        videoId: source.stream.uid,
        shareLink: source.stream.url,
      };
    }
  }

  return null;
};

/**
   * Fetch video properties associated with the currently
   * selected language.& captions state
   * @param {object} unit currently selected video
   * @return video props object
   */
export const getVideoSource = ( unit, captions ) => {
  if ( unit && Array.isArray( unit.source ) ) {
    const source = unit.source.find( caption => caption.burnedInCaptions === 'true' === captions );

    if ( source && source.stream && source.stream.url ) {
      return source.stream.uid;
    }
  }

  return null;
};

/**
   * Fetches video props from available source
   * YouTube > Vimeo > CloudFlare
   *
   * @param {object} unit currently selected language
   * @return Promise with video props
   */
export const fetchVideoPlayer = async ( unit, captions ) => {
  // render YouTube player if link available
  const youTubeProps = await getYouTube( unit, captions );

  if ( youTubeProps && youTubeProps.videoId ) {
    return Promise.resolve( {
      props: { id: youTubeProps.videoId, source: 'youtube' },
      shareLink: youTubeProps.shareLink,
    } );
  }

  // fallback to Vimeo if no YouTube link available
  const vimeoProps = await getVimeo( unit, captions );

  if ( vimeoProps && vimeoProps.videoId ) {
    return Promise.resolve( {
      props: { id: vimeoProps.videoId, source: 'vimeo' },
      shareLink: vimeoProps.shareLink,
    } );
  }

  // fallback to CloudFlare player if no YouTube or vimeo link available
  const uid = getVideoSource( unit, captions );
  const active = !!uid;
  const icon = active ? 'video play' : 'warning circle';

  return Promise.resolve( { props: { active, icon, url: `https://iframe.cloudflarestream.com/${uid}` } } );
};
