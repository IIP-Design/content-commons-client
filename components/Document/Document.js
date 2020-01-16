import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import { updateUrl } from 'lib/browser';

import { Button } from 'semantic-ui-react';
import 'styles/tooltip.scss';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';
import Notification from 'components/Notification/Notification';
import Share from 'components/Share/Share';
import PopupTrigger from 'components/popups/PopupTrigger';
import Popup from 'components/popups/Popup';

import ModalItem from 'components/modals/ModalItem';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';

import { getPreviewNotificationStyles } from 'lib/utils';

const Document = props => {
  const { isAdminPreview, displayAsModal, item } = props;
  const {
    id,
    published,
    owner,
    site,
    title,
    content,
    content: { rawText },
    logo,
    language,
    documentUrl,
    documentUse,
    tags,
    type,
  } = item;

  useEffect( () => {
    if ( !displayAsModal ) {
      updateUrl( `/document?id=${id}&site=${site}&language=${language.locale}` );
    }
  }, [] );

  const DownloadElement = isAdminPreview ? 'span' : 'a';

  // disallow <script></script> tags
  const parseHtml = htmlParser( {
    isValidNode: node => node.type !== 'script'
  } );

  return (
    <ModalItem headline={ title } className={ isAdminPreview ? 'package-item-preview' : '' }>
      <div className="modal_options modal_options--noLanguage">
        <div>
          { isAdminPreview
            && (
              <Notification
                el="p"
                show
                customStyles={ getPreviewNotificationStyles() }
                msg="This is a preview of your file on Content Commons."
              />
            ) }
          <InternalUseDisplay />
          <PopupTrigger
            toolTip="Share document"
            icon={ { img: shareIcon, dim: 20 } }
            show
            content={ (
              <Popup title="Copy the link to share internally.">
                <Share
                  id={ id }
                  site={ site }
                  title={ title }
                  language={ language.locale }
                  type={ type }
                  { ...( isAdminPreview ? { isPreview: true } : {} ) }
                />
              </Popup>
            ) }
          />
          <Button className="trigger" tooltip="Not For Public Distribution">
            <DownloadElement
              { ...( isAdminPreview
                ? {}
                : {
                  href: documentUrl,
                  className: 'trigger',
                  download: true,
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }
              ) }
            >
              <img
                src={ downloadIcon }
                width={ 18 }
                height={ 18 }
                alt="Download document icon"
              />
            </DownloadElement>
          </Button>
        </div>
      </div>

      { content && content.html && isAdminPreview
        && (
          <ReactMarkdown
            className="body"
            source={ content.html }
            // must sanitize html during docx conversion
            escapeHtml={ false }
            astPlugins={ [parseHtml] }
          />
        ) }

      { content
        && !content.html
        && !content.rawText
        && !content.markdown
        && <ModalDescription description="No text available" /> }

      { !isAdminPreview && <ModalDescription description={ rawText } /> }

      <ModalPostMeta
        type={ type }
        logo={ logo }
        source={ owner }
        datePublished={ published }
        releaseType={ documentUse }
      />
      <ModalPostTags tags={ tags } />
      <InternalUseDisplay expanded />
    </ModalItem>
  );
};

Document.defaultProps = {
  isAdminPreview: false,
};

Document.propTypes = {
  isAdminPreview: PropTypes.bool,
  displayAsModal: PropTypes.bool,
  item: PropTypes.shape( {
    id: PropTypes.string,
    published: PropTypes.string,
    author: PropTypes.string,
    owner: PropTypes.string,
    site: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.object,
    logo: PropTypes.string,
    thumbnail: PropTypes.string,
    language: PropTypes.object,
    documentUrl: PropTypes.string,
    documentUse: PropTypes.string,
    tags: PropTypes.array,
    type: PropTypes.string,
  } ),
};

export default Document;
