import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

import { getItemRequest } from 'lib/elastic/api';
import { normalizeItem } from 'lib/elastic/parser';
import { updateUrl } from 'lib/browser';
import { withRouter } from 'next/router';

import embedIcon from 'static/icons/icon_embed.svg';
import shareIcon from 'static/icons/icon_share.svg';

import ModalItem from 'components/modals/ModalItem';
import ModalLangDropdown from 'components/modals/ModalLangDropdown/ModalLangDropdown';
import ModalContentMeta from 'components/modals/ModalContentMeta/ModalContentMeta';
import ModalImage from 'components/modals/ModalImage/ModalImage';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';
import ModalText from 'components/modals/ModalText/ModalText';


import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from 'components/popups/PopupTabbed';
import Popup from 'components/popups/Popup';

import Share from 'components/Share/Share';
import EmbedPost from './EmbedPost';
import EmbedHelp from './EmbedHelp';

const Post = ( { item, router } ) => {
  const { publicRuntimeConfig } = getConfig();
  const [selectedItem, setSelectedItem] = useState( item );
  const [selectedLanguage, setSelectedLanguage] = useState(
    // eslint-disable-next-line camelcase
    item?.language?.display_name ? item.language.display_name : 'English',
  );
  const [textDirection, setTextDirection] = useState(
    // eslint-disable-next-line camelcase
    item?.language?.text_direction ? item.language.text_direction : 'ltr',
  );

  useEffect( () => {
    if ( selectedItem ) {
      const language = selectedItem.languages.find( lang => lang.language.display_name === selectedLanguage );

      if ( language && language.post_id ) {
        getItemRequest( selectedItem.site, language.post_id )
          .then( response => {
            if ( response && response.hits.total > 0 ) {
              setSelectedItem( normalizeItem( response.hits.hits[0] ) );
            }
          } );
      }
    }
  }, [selectedLanguage] );

  useEffect( () => {
    const { pathname } = router;

    if ( selectedItem ) {
      const { id, site, language } = selectedItem;

      setTextDirection( language.text_direction );
      if ( id && site && pathname === '/article' ) {
        updateUrl( `/article?id=${id}&site=${site}` );
      }
    }
  }, [selectedItem, router] );

  if ( selectedItem ) {
    const embedItem
    // eslint-disable-next-line max-len
    = `<div id="cdp-article-embed"></div><script async id="cdpArticle" data-id="${selectedItem.id}" data-site="${selectedItem.site}" src="${publicRuntimeConfig.REACT_APP_CDP_MODULES_URL}${publicRuntimeConfig.REACT_APP_SINGLE_ARTICLE_MODULE}"></script>`;

    return (
      <ModalItem headline={ selectedItem.title } textDirection={ textDirection }>
        <div className="modal_options">
          <div className="modal_options_left">
            <ModalLangDropdown
              item={ selectedItem }
              selected={ selectedLanguage }
              handleLanguageChange={ value => setSelectedLanguage( value ) }
            />
          </div>
          <div className="trigger-container">
            <PopupTrigger
              toolTip="Embed this article"
              icon={ { img: embedIcon, dim: 24 } }
              show
              content={ (
                <PopupTabbed
                  title="Embed this article on your site"
                  panes={ [
                    {
                      title: 'Copy Embed Code',
                      component: (
                        <EmbedPost
                          instructions="Copy and paste the code below to embed article on your site"
                          embedItem={ embedItem }
                        />
                      ),
                    },
                    { title: 'Help', component: <EmbedHelp /> },
                  ] }
                />
              ) }
            />
            <PopupTrigger
              toolTip="Share article"
              icon={ { img: shareIcon, dim: 20 } }
              show
              content={ (
                <Popup title="Share this article.">
                  <Share
                    id={ selectedItem.id }
                    language={ selectedItem.language.locale }
                    link={ selectedItem.link }
                    site={ selectedItem.site }
                    title={ selectedItem.title }
                    type={ selectedItem.type }
                  />
                </Popup>
              ) }
            />
          </div>
        </div>
        <ModalImage thumbnail={ selectedItem?.thumbnail || '' } thumbnailMeta={ selectedItem.thumbnailMeta } />
        <ModalContentMeta type={ selectedItem.type } dateUpdated={ selectedItem.modified } />
        <ModalText textContent={ selectedItem.content } />
        <ModalPostMeta
          type={ selectedItem.type }
          sourcelink={ selectedItem.sourcelink }
          logo={ selectedItem.logo }
          source={ selectedItem.site }
          datePublished={ selectedItem.published }
          originalLink={ selectedItem.link }
        />
        <ModalPostTags tags={ selectedItem.categories } />
      </ModalItem>
    );
  }

  return <ModalItem headline="Content Unavailable" />;
};

Post.propTypes = {
  router: PropTypes.object,
  item: PropTypes.object,
};

export default withRouter( Post );
