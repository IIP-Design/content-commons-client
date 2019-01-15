import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getItemRequest } from '../../lib/elastic/api';
import { normalizeItem } from '../../lib/elastic/parser';

import embedIcon from '../../static/icons/icon_embed.svg';
import shareIcon from '../../static/icons/icon_share.svg';

import ModalItem from '../modals/ModalItem';
import ModalLangDropdown from '../modals/ModalLangDropdown/ModalLangDropdown';
import ModalContentMeta from '../modals/ModalContentMeta/ModalContentMeta';
import ModalImage from '../modals/ModalImage/ModalImage';
import ModalPostMeta from '../modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from '../modals/ModalPostTags/ModalPostTags';
import ModalText from '../modals/ModalText/ModalText';


import PopupTrigger from '../popups/PopupTrigger';
import PopupTabbed from '../popups/PopupTabbed';
import Popup from '../popups/Popup';

import Share from '../Share';
import EmbedPost from './EmbedPost';
import EmbedHelp from './EmbedHelp';

class Post extends Component {
  constructor( props ) {
    super( props );
    const { item } = this.props;
    this.state = {
      item,
      selectedLanguage: this.getLanguage(),
      textDirection: item.language.text_direction
    };
    this.handleLanguageChange = this.handleLanguageChange.bind( this );
  }

  onFetchResult = ( response, value ) => {
    if ( response && response.hits.total > 0 ) {
      const item = normalizeItem( response.hits.hits[0] );
      this.setState( {
        item,
        selectedLanguage: value,
        textDirection: item.language.text_direction
      } );
    }
  }

  getLanguage() {
    const { language } = this.props.item;
    if ( !language ) return 'English';
    return language.display_name;
  }

  handleLanguageChange( value ) {
    const { item } = this.state;
    const language = item.languages.find( lang => lang.language.display_name === value );
    if ( language && language.post_id ) {
      getItemRequest( item.site, language.post_id )
        .then( response => this.onFetchResult( response, value ) );
    }
  }

  render() {
    if ( this.state && this.state.item ) {
      const { item, textDirection } = this.state;
      const embedItem = (
        `<div id="cdp-article-embed"></div><script async id="cdpArticle" data-id="${item.id}" data-site="${item.site}" src="${process.env.REACT_APP_CDP_MODULES_URL}${process.env.REACT_APP_SINGLE_ARTICLE_MODULE}"></script>`
      );

      return (
        <ModalItem headline={ item.title } textDirection={ textDirection }>
          <div className="modal_options">
            <div className="modal_options_left">
              <ModalLangDropdown
                item={ this.props.item }
                selected={ this.state.selectedLanguage }
                handleLanguageChange={ this.handleLanguageChange }
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
                        )
                      },
                      { title: 'Help', component: <EmbedHelp /> }
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
                      id={ item.id }
                      language={ item.language.locale }
                      link={ item.link }
                      site={ item.site }
                      title={ item.title }
                      type={ item.type }
                    />
                  </Popup>
) }
              />
            </div>
          </div>
          <ModalImage thumbnail={ item.thumbnail } thumbnailMeta={ item.thumbnailMeta } />
          <ModalContentMeta type={ item.type } dateUpdated={ item.modified } />
          <ModalText textContent={ item.content } />
          <ModalPostMeta
            type={ item.type }
            author={ item.author }
            sourcelink={ item.sourcelink }
            logo={ item.logo }
            source={ item.site }
            datePublished={ item.published }
            originalLink={ item.link }
          />
          <ModalPostTags tags={ item.categories } />
        </ModalItem>
      );
    }
    return <ModalItem headline="Content Unavailable" />;
  }
}

Post.propTypes = {
  item: PropTypes.object
};

export default Post;
