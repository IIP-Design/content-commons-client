import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Embed, Checkbox } from 'semantic-ui-react';
import axios from 'axios';
import config from 'config';
import { withRouter } from 'next/router';

import { getYouTubeId } from 'lib/utils';
import { updateUrl } from 'lib/browser';

// import plusIcon from '../assets/icons/icon_plus.svg';
import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';
import embedIcon from 'static/icons/icon_embed.svg';

import ModalItem from '../modals/ModalItem';
import ModalLangDropdown from '../modals/ModalLangDropdown/ModalLangDropdown';
import ModalContentMeta from '../modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from '../modals/ModalDescription/ModalDescription';
import ModalPostMeta from '../modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from '../modals/ModalPostTags/ModalPostTags';

import PopupTrigger from '../popups/PopupTrigger';
import PopupTabbed from '../popups/PopupTabbed';
import Popup from '../popups/Popup';

import DownloadVideo from './DownloadVideo';
import DownloadSrt from './DownloadSrt';
import DownloadTranscript from './DownloadTranscript';
import DownloadHelp from './DownloadHelp';
import Share from '../Share/Share';
import EmbedVideo from '../Embed';
import EmbedHelp from './EmbedHelp';

import './Video.scss';

class Video extends Component {
  constructor( props ) {
    super( props );

    const { item } = this.props;
    this.state = {
      unit: item.selectedLanguageUnit,
      selectedLanguage: this.getLanguage( item.selectedLanguageUnit ),
      captions: this.getCaptions( item.selectedLanguageUnit ),
      videoProps: null,
      shareLink: ''
    };
  }

  /**
   * Update the url location and fetch the video player properties
   * Fetch video props here as opoposed to render because we have to
   * do an async request to check validity of youtube link
   */
  componentDidMount() {
    this.willUpdateUrl();
    this.willFetchVideoPlayer();
  }

  shouldComponentUpdate( nextProps, nextState ) {
    const { selectedLanguageUnit } = nextProps.item;
    if ( selectedLanguageUnit.language.locale !== nextState.selectedLanguage.locale
      || this.state.videoProps !== nextState.videoProps
      || this.state.captions !== nextState.captions ) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    this.willUpdateUrl();
  }

  /**
   * Get the video data associated with currently selected language
   */
  getSelectedUnit = ( language = 'English' ) => (
    this.props.item.units.find( lang => lang.language.display_name === language )
  )

  /**
   * Fetch video properties associated with the currently
   * selected language.& captions state
   * @param {object} unit currently selected languaVideoge
   * @return video props object
   */
  getVideoSource = unit => {
    const { captions } = this.state;
    if ( unit && Array.isArray( unit.source ) ) {
      const source = unit.source.find( caption => ( caption.burnedInCaptions === 'true' ) === captions );
      if ( source && source.stream && source.stream.url ) {
        return source.stream.uid;
      }
    }
    return null;
  };

  /**
   * Fetches a video props from a valid youtube link by:
   * 1. Checks for available stream object in selected language
   * 2. Fetches youtube id from available stream object
   * 3. If valid youtube id is returned, checks to see if url is reachable
   * 4. If reachable url, return props else return null
   *
   * @param {object} unit currently selected language
   * @return Resolved Promise with video props or null
   */
  getYouTube = async unit => {
    const { captions } = this.state;

    if ( unit && Array.isArray( unit.source ) ) {
      const source = unit.source.find( caption => ( caption.burnedInCaptions === 'true' ) === captions );

      if ( source && source.streamUrl ) {
        const streamObj = source.streamUrl.find( stream => stream.site === 'youtube' );

        if ( streamObj && streamObj.site === 'youtube' && streamObj.url ) {
          const youtubeUrl = streamObj.url;
          const videoId = getYouTubeId( youtubeUrl );

          if ( videoId ) {
            const res = await this.checkForValidYouTube( videoId );
            if ( res ) {
              // use youtube embed format to avoid x-origin issuues
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
   * @return vimreo id
   */
  getVimeo = unit => {
    const { captions } = this.state;
    if ( unit && Array.isArray( unit.source ) ) {
      const source = unit.source.find( caption => ( caption.burnedInCaptions === 'true' ) === captions );
      if ( source && source.stream && source.stream.site === 'vimeo' && source.stream.url ) {
        return {
          videoId: source.stream.uid,
          shareLink: source.stream.url
        };
      }
    }
    return null;
  };

  getVideoTranscript = unit => {
    if ( unit ) {
      if ( unit.transcript && unit.transcript.text ) {
        return unit.transcript.text;
      }
    } else {
      return '';
    }
  };

  getLanguage = unit => {
    if ( unit && unit.language ) {
      return unit.language;
    }
    return { display_name: 'English', locale: 'en-us', text_direction: 'ltr' };
  };

  /**
   * Some videos have 2 formats: clean (no burned in captions) and
   * with captions (video has captions burned into file). Check see what format to return
   * Note: The burnedInCaptions porperty is coming in as 'true' and 'false' strings. Need to coerce
   * in spots to ensure valid comparison.  Going forweard, try to avoid 'true' and 'false' strings
   *
   * @param {object} unit currently selected language
   * @return true (format to load video with captions) or false (clean file)
   */
  getCaptions = unit => {
    if ( unit && unit.source && unit.source[0] ) {
      return unit.source[0].burnedInCaptions === 'true'; // coerce to a boolean
    }
    return false;
  };


  /**
   * Executes youtube API call to verify reachable, valid youtube url
   *
   * @param {string} youitube id
   * @return Promise
   */
  checkForValidYouTube = async id => {
    if ( config.YOUTUBE_API_URL && process.env.REACT_APP_YOUTUBE_API_KEY ) {
      const url = `${config.YOUTUBE_API_URL}?part=id&id=${id}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;
      try {
        const res = await axios.get( url );
        if ( res.data && res.data.pageInfo && res.data.pageInfo.totalResults > 0 ) return res;
      } catch ( err ) {
        return Promise.resolve( null );
      }
    }
    return Promise.resolve( null );
  };

  handleLanguageChange = value => {
    if ( value && value !== this.state.selectedLanguage.display_name ) {
      const unit = this.getSelectedUnit( value );
      this.setState( { captions: this.getCaptions( unit ) }, async () => {
        const video = await this.fetchVideoPlayer( unit );
        if ( unit ) {
          this.setState( {
            unit,
            selectedLanguage: this.getLanguage( unit ),
            videoProps: video.props,
            shareLink: video.shareLink
          } );
        }
      } );
    }
  };

  /**
   * Toggle video between one with burned in captions and one without
   */
  handleCaptionChange = () => {
    // TODO: Fix this linting errror
    /* eslint-disable-next-line react/no-access-state-in-setstate */
    this.setState( { captions: !this.state.captions }, () => {
      this.willFetchVideoPlayer();
    } );
  }

  /**
   * Helper function to fetch video properties
   * Using it to set state as it is bad practice to set state
   * in componentDidMount
   */
  async willFetchVideoPlayer() {
    // TODO: Fix this linting errror
    /* eslint-disable-next-line react/no-access-state-in-setstate */
    const video = await this.fetchVideoPlayer( this.state.unit );
    this.setState( {
      videoProps: video.props,
      shareLink: video.shareLink
    } );
  }

  /**
   * Update the location url the direct link to selected video
   */
  willUpdateUrl() {
    const { pathname } = this.props.router;
    const { id, site } = this.props.item;
    const { selectedLanguage } = this.state;
    if ( id && site && selectedLanguage && pathname === '/video' ) {
      updateUrl( `/video?id=${id}&site=${site}&language=${selectedLanguage.locale}` );
    }
  }

  /**
   * Fetches video props from available source
   * YouTube > Vimeo > CloudFlare
   *
   * @param {object} unit currently selected language
   * @return Promise with video props
   */
  async fetchVideoPlayer( unit ) {
    // render youtube player if link available
    const youTubeProps = await this.getYouTube( unit );
    if ( youTubeProps && youTubeProps.videoId ) {
      return Promise.resolve( {
        props: { id: youTubeProps.videoId, source: 'youtube' },
        shareLink: youTubeProps.shareLink
      } );
    }

    // fallback to Vimeo if no youtube link available
    const vimeoProps = await this.getVimeo( unit );
    if ( vimeoProps && vimeoProps.videoId ) {
      return Promise.resolve( {
        props: { id: vimeoProps.videoId, source: 'vimeo' },
        shareLink: vimeoProps.shareLink
      } );
    }

    // fallback to CloudFlare player if no youtube or vimeo link available
    const uid = this.getVideoSource( unit );
    const active = !!uid;
    const icon = active ? 'video play' : 'warning circle';

    return Promise.resolve( { props: { active, icon, url: `https://iframe.cloudflarestream.com/${uid}` } } );
  }

  render() {
    const {
      unit, selectedLanguage, captions, videoProps, shareLink
    } = this.state;
    const {
      type, logo, author, team, published, modified, id, site
    } = this.props.item;

    const toggleCaptions = [...new Set( unit.source.map( item => item.burnedInCaptions ) )];
    const embedItem = ( shareLink )
    // eslint-disable-next-line max-len
      ? `<iframe src="${shareLink}" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`
      : '';

    if ( unit && selectedLanguage ) {
      return (
        <ModalItem headline={ unit.title } textDirection={ selectedLanguage.text_direction }>
          <div className="modal_options">
            <div className="modal_options_left">
              <ModalLangDropdown
                item={ this.props.item }
                selected={ selectedLanguage.display_name }
                handleLanguageChange={ this.handleLanguageChange }
              />
              { toggleCaptions.length > 1 && (
                <Checkbox
                  className="modal_captions"
                  checked={ captions }
                  toggle
                  label="Video with captions"
                  onChange={ this.handleCaptionChange }
                />
              ) }
            </div>
            <div className="trigger-container">
              { embedItem && (
              <PopupTrigger
                toolTip="Embed video"
                icon={ { img: embedIcon, dim: 24 } }
                show
                content={ (
                  <PopupTabbed
                    title="Embed this video on your site"

                    panes={ [
                      {
                        title: 'Copy Embed Code',
                        component: (
                          <EmbedVideo
                            instructions="Copy and paste the code below to embed video on your site"
                            embedItem={ embedItem || null }
                          />
                        )
                      },
                      { title: 'Help', component: <EmbedHelp /> }
                    ] }
                  />
) }
              />
              ) }
              <PopupTrigger
                toolTip="Share video"
                icon={ { img: shareIcon, dim: 20 } }
                show={ type === 'video' }
                content={ (
                  <Popup title="Share this video.">
                    <Share
                      link={ shareLink }
                      id={ id }
                      site={ site }
                      title={ unit.title }
                      language={ selectedLanguage.locale }
                      type={ this.props.item.type }
                    />
                  </Popup>
) }
              />
              <PopupTrigger
                toolTip="Download video"
                icon={ { img: downloadIcon, dim: 18 } }
                position="right"
                show={ type === 'video' }
                content={ (
                  <PopupTabbed
                    title="Download this video."
                    panes={ [
                      {
                        title: 'Video File',
                        component: (
                          <DownloadVideo
                            selectedLanguageUnit={ unit }
                            instructions={ `Download the video and SRT files in ${unit.language.display_name}.
                              This download option is best for uploading this video to web pages.` }
                            burnedInCaptions={ captions }
                          />
                        )
                      },
                      {
                        title: 'SRT',
                        component: (
                          <DownloadSrt
                            selectedLanguageUnit={ unit }
                            instructions="Download SRTs"
                            item={ this.props.item }
                          />
                        )
                      },
                      {
                        title: 'Transcript',
                        component: (
                          <DownloadTranscript item={ this.props.item } instructions="Download Transcripts" />
                        )
                      },
                      { title: 'Help', component: <DownloadHelp /> }
                    ] }
                  />
) }
              />
            </div>
          </div>

          <Embed { ...videoProps } placeholder={ unit.thumbnail || this.props.item.thumbnail } />

          <ModalContentMeta type={ type } dateUpdated={ modified } transcript={ this.getVideoTranscript() } />
          <ModalDescription description={ unit.desc } />
          <ModalPostMeta author={ author } logo={ logo } source={ team } datePublished={ published } />
          <ModalPostTags tags={ unit.categories } />
        </ModalItem>
      );
    }

    return <ModalItem headline="Content Unavailable" />;
  }
}

Video.propTypes = {
  router: PropTypes.object,
  item: PropTypes.object
};

export default withRouter( Video );
