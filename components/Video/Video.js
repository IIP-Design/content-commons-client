import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Embed, Checkbox } from 'semantic-ui-react';
import Link from 'next/link';
import { withRouter } from 'next/router';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';
import embedIcon from 'static/icons/icon_embed.svg';

import ModalItem from 'components/modals/ModalItem';
import ModalLangDropdown from 'components/modals/ModalLangDropdown/ModalLangDropdown';
import ModalContentMeta from 'components/modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';

import Popover from 'components/popups/Popover/Popover';
import DownloadItem from 'components/download/DownloadItem/DownloadItem';
import TabLayout from 'components/TabLayout/TabLayout';

import DownloadVideo from './Download/DownloadVideo';
import DownloadCaption from './Download/DownloadCaption';
import DownloadThumbnailsAndOtherFiles from './Download/DownloadThumbnailsAndOtherFiles';
import DownloadHelp from './Download/DownloadHelp';
import Share from '../Share/Share';
import EmbedVideo from '../Embed';
import EmbedHelp from './Download/EmbedHelp';

import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';

import { updateUrl } from 'lib/browser';
import useSignedUrl from 'lib/hooks/useSignedUrl';
import { displayDOSLogo } from 'lib/sourceLogoUtils';
import { useAuth } from 'context/authContext';
import { fetchVideoPlayer, getCaptions, getLanguage, getVideoTranscript } from './utils';

import './Video.scss';

const Video = ( { item, router, isAdminPreview = false } ) => {
  const {
    id, logo, modified, owner, published, selectedLanguageUnit, site, type, visibility,
  } = item;
  const { user } = useAuth();

  const [unit, setUnit] = useState( selectedLanguageUnit );
  const [selectedLanguage, setSelectedLanguage] = useState( getLanguage( selectedLanguageUnit ) );
  const [captions, setCaptions] = useState( getCaptions( item.selectedLanguageUnit ) );
  const [videoProps, setVideoProps] = useState( null );
  const [shareLink, setShareLink] = useState( '' );

  const { signedUrl: unitThumb } = useSignedUrl( unit?.thumbnail ? unit.thumbnail : '' );
  const { signedUrl: itemThumb } = useSignedUrl( item?.thumbnail ? item.thumbnail : '' );

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

    if ( video.props ) {
      setVideoProps( video.props );
    }

    if ( video.shareLink ) {
      setShareLink( video.shareLink );
    }
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

  const getAuthorizedDownloadTabs = ( { tabs, unauthorizedTab } ) => {
    const indexToRemove = tabs.findIndex( tab => tab.title === unauthorizedTab );

    // remove specified tab if user is not logged in
    if ( user && user.id === 'public' ) {
      tabs.splice( indexToRemove, 1 );
    }

    return tabs;
  };

  /**
   * Get the video data associated with currently selected language
   */
  const getSelectedUnit = ( language = 'English' ) => item.units.find( lang => lang.language.display_name === language );

  const getUnitWithCleanVideos = units => units.find( u => u.source.some( file => file?.use === 'Clean' ) );

  const handleLanguageChange = value => {
    if ( value && value !== selectedLanguage.display_name ) {
      const selected = getSelectedUnit( value );

      setCaptions( getCaptions( selected ) );

      const getStuff = async () => {
        const video = await fetchVideoPlayer( selected );

        if ( selected ) {
          setUnit( selected );
          setSelectedLanguage( getLanguage( selected ) );
          if ( video.props ) {
            setVideoProps( video.props );
          }
          if ( video.shareLink ) {
            setShareLink( video.shareLink );
          }
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

  const embedItem = shareLink
    ? `<iframe src="${shareLink}" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`
    : '';

  const unitWithCleanVideos = getUnitWithCleanVideos( item.units );

  const downloadTabs = [
    {
      title: 'Video Files',
      content: (
        <DownloadItem
          instructions={ `Download the video and caption files in ${unit.language.display_name}.
          This download option is best for uploading this video to web pages and social media.` }
        >
          <DownloadVideo
            selectedLanguageUnit={ unit }
            burnedInCaptions
            isAdminPreview={ isAdminPreview }
          />
        </DownloadItem>
      ),
    },
    {
      title: 'For Translation',
      content: (
        <DownloadItem
          instructions="Download a clean version (no-text version) of the video, for adding translated subtitles."
        >
          <DownloadVideo
            selectedLanguageUnit={ unitWithCleanVideos || unit }
            burnedInCaptions={ false }
            isAdminPreview={ isAdminPreview }
          />
        </DownloadItem>
      ),
    },
    {
      title: 'Caption Files',
      content: (
        <DownloadItem
          instructions={ (
            <p>
              By downloading these editable files, you agree to the
              { ' ' }
              <Link href="/about"><a>Terms of Use</a></Link>
              .
            </p>
          ) }
        >
          <DownloadCaption
            selectedLanguageUnit={ unit }
            item={ item }
          />
        </DownloadItem>
      ),
    },
    {
      title: 'Other',
      content: (
        <DownloadItem
          instructions={ (
            <p>
              By downloading these files, you agree to the
              { ' ' }
              <Link href="/about"><a>Terms of Use</a></Link>
              .
            </p>
          ) }
        >
          <DownloadThumbnailsAndOtherFiles item={ item } />
        </DownloadItem>
      ),
    },
    {
      title: 'Help',
      content: <DownloadHelp />,
    },
  ];

  if ( unit && selectedLanguage ) {
    const toggleCaptions = [...new Set( unit.source.map( u => u.burnedInCaptions ) )];

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
            {toggleCaptions.length > 1 && (
              <Checkbox
                className="modal_captions"
                checked={ captions }
                toggle
                label="Video with subtitles"
                onChange={ handleCaptionChange }
              />
            )}
          </div>
          <div className="trigger-container">
            {visibility === 'INTERNAL'
              && <InternalUseDisplay style={ { margin: '0 1em 0 1em' } } />}
            {embedItem && (
              <Popover
                toolTip="Embed video"
                id={ `${id}_video-embed` }
                className="video-project__popover video-project__popover--embed"
                expandFromRight
                trigger={ <img src={ embedIcon } style={ { width: '20px', height: '20px' } } alt="embed icon" /> }
              >
                <TabLayout
                  headline="Embed this video."
                  tabs={ [
                    {
                      title: 'Copy Embed Code',
                      content: (
                        <EmbedVideo
                          instructions="Copy and paste the code below to embed video on your site"
                          embedItem={ embedItem || null }
                        />
                      ),
                    },
                    {
                      title: 'Help',
                      content: <EmbedHelp />,
                    },
                  ] }
                />
              </Popover>
            )}
            <Popover
              toolTip="Share video"
              id={ `${id}_video-share` }
              className="video-project__popover video-project__popover--share"
              trigger={ <img src={ shareIcon } style={ { width: '20px', height: '20px' } } alt="share icon" /> }
              expandFromRight
            >
              <div className="popup_share">
                <h2 className="ui header">Share this video.</h2>
                <Share
                  link={ shareLink }
                  id={ id }
                  site={ site }
                  title={ unit.title }
                  language={ selectedLanguage.locale }
                  type={ item.type }
                />
              </div>
            </Popover>
            <Popover
              toolTip="Download video"
              id={ `${id}_video-download` }
              className="video-project__popover video-project__popover--download"
              trigger={ (
                <img
                  src={ downloadIcon }
                  style={ { width: '18px', height: '18px' } }
                  alt="download icon"
                />
              ) }
              expandFromRight
            >
              <TabLayout
                headline="Download this video."
                tabs={ getAuthorizedDownloadTabs( {
                  tabs: downloadTabs,
                  unauthorizedTab: 'For Translation',
                } ) }
              />
            </Popover>
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
  isAdminPreview: PropTypes.bool,
};

export default withRouter( Video );
