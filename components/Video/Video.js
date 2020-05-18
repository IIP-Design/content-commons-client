import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Embed, Checkbox } from 'semantic-ui-react';
import { withRouter } from 'next/router';

import { updateUrl } from 'lib/browser';
import { displayDOSLogo } from 'lib/sourceLogoUtils';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';
import embedIcon from 'static/icons/icon_embed.svg';

import ModalItem from 'components/modals/ModalItem';
import ModalLangDropdown from 'components/modals/ModalLangDropdown/ModalLangDropdown';
import ModalContentMeta from 'components/modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';

import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from 'components/popups/PopupTabbed';
import Popup from 'components/popups/Popup';

import DownloadVideo from './DownloadVideo';
import DownloadCaption from './DownloadCaption';
import DownloadTranscript from './DownloadTranscript';
import DownloadHelp from './DownloadHelp';
import Share from '../Share/Share';
import EmbedVideo from '../Embed';
import EmbedHelp from './EmbedHelp';
import useSignedUrl from 'lib/hooks/useSignedUrl';
import { fetchVideoPlayer, getCaptions, getLanguage, getVideoTranscript } from './utils';

import './Video.scss';

const Video = ( { item, router } ) => {
  const {
    id, logo, modified, owner, published, selectedLanguageUnit, site, type,
  } = item;

  const [unit, setUnit] = useState( selectedLanguageUnit );
  const [selectedLanguage, setSelectedLanguage] = useState( getLanguage( selectedLanguageUnit ) );
  const [captions, setCaptions] = useState( getCaptions( item.selectedLanguageUnit ) );
  const [videoProps, setVideoProps] = useState( null );
  const [shareLink, setShareLink] = useState( '' );

  const { signedUrl: unitThumb } = useSignedUrl( unit.thumbnail );
  const { signedUrl: itemThumb } = useSignedUrl( item.thumbnail );

  /**
   * Update the location url the direct link to selected video
   */
  const willUpdateUrl = () => {
    const { pathname } = router;

    if ( id && site && selectedLanguage && pathname === '/video' ) {
      updateUrl( `/video?id=${id}&site=${site}&language=${selectedLanguage.locale}` );
    }
  };

  /**
   * Helper function to fetch video properties
   * Using it to set state as it is bad practice to set state
   * in componentDidMount
   */
  const willFetchVideoPlayer = async () => {
    const video = await fetchVideoPlayer( unit, captions );

    setVideoProps( video.props );
    setShareLink( video.shareLink );
  };

  /**
   * Update the url location and fetch the video player properties
   * Fetch video props here as opposed to render because we have to
   * do an async request to check validity of YouTube link
   */
  useEffect( () => {
    willUpdateUrl();
    willFetchVideoPlayer();
  }, [unit, captions] );

  useEffect( () => {
    // shouldComponentUpdate( nextProps, nextState ) {
    //   const { selectedLanguageUnit } = nextProps.item;

    //   if ( selectedLanguageUnit.language.locale !== nextState.selectedLanguage.locale
    //     || this.state.videoProps !== nextState.videoProps
    //     || this.state.captions !== nextState.captions ) {
    //     return true;
    //   }

    //   return false;
    // }
  }, [] );

  /**
   * Get the video data associated with currently selected language
   */
  const getSelectedUnit = ( language = 'English' ) => item.units.find( lang => lang.language.display_name === language );

  const handleLanguageChange = value => {
    if ( value && value !== selectedLanguage.display_name ) {
      const selected = getSelectedUnit( value );

      setCaptions( getCaptions( selected ) );

      const getStuff = async () => {
        const video = await fetchVideoPlayer( selected );

        if ( selected ) {
          setUnit( selected );
          setSelectedLanguage( getLanguage( selected ) );
          setVideoProps( video.props );
          setShareLink( video.shareLink );
        }
      };

      getStuff();
    }
  };

  /**
   * Toggle video between one with burned in captions and one without
   */
  const handleCaptionChange = () => {
    setCaptions( !captions );
    willFetchVideoPlayer();
  };

  const toggleCaptions = [...new Set( unit.source.map( u => u.burnedInCaptions ) )];
  const embedItem = shareLink
    ? `<iframe src="${shareLink}" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`
    : '';

  if ( unit && selectedLanguage ) {
    return (
      <ModalItem
        headline={ unit.title }
        textDirection={ selectedLanguage.text_direction }
        lang={ selectedLanguage.language_code }
      >
        <div className="modal_options">
          <div className="modal_options_left">
            <ModalLangDropdown
              item={ item }
              selected={ selectedLanguage.display_name }
              handleLanguageChange={ handleLanguageChange }
            />
            { toggleCaptions.length > 1 && (
              <Checkbox
                className="modal_captions"
                checked={ captions }
                toggle
                label="Video with captions"
                onChange={ handleCaptionChange }
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
                        ),
                      },
                      { title: 'Help', component: <EmbedHelp /> },
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
                    type={ item.type }
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
                      ),
                    },
                    {
                      title: 'Caption File',
                      component: (
                        <DownloadCaption
                          selectedLanguageUnit={ unit }
                          instructions="Download caption file(s) for this video."
                          item={ item }
                        />
                      ),
                    },
                    {
                      title: 'Transcript',
                      component: <DownloadTranscript item={ item } instructions="Download Transcripts" />,
                    },
                    { title: 'Help', component: <DownloadHelp /> },
                  ] }
                />
              ) }
            />
          </div>
        </div>

        <Embed { ...videoProps } placeholder={ unitThumb || itemThumb } />

        <ModalContentMeta type={ type } dateUpdated={ modified } transcript={ getVideoTranscript() } />
        <ModalDescription description={ unit.desc } />
        <ModalPostMeta
          logo={ logo || displayDOSLogo( owner ) }
          source={ owner }
          datePublished={ published }
        />
        <ModalPostTags tags={ unit.categories } />
      </ModalItem>
    );
  }

  return <ModalItem headline="Content Unavailable" />;
};

Video.propTypes = {
  router: PropTypes.object,
  item: PropTypes.object,
};

export default withRouter( Video );
