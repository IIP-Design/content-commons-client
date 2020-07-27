import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { updateUrl } from 'lib/browser';
import { parseHtml, getPreviewNotificationStyles } from 'lib/utils';

import { Button } from 'semantic-ui-react';
import 'styles/tooltip.scss';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';
import Notification from 'components/Notification/Notification';
import Share from 'components/Share/Share';
import Popover from 'components/popups/Popover/Popover';

import ModalItem from 'components/modals/ModalItem';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';

import useSignedUrl from 'lib/hooks/useSignedUrl';

import './Document.scss';

// disallow <script></script> tags
// export const parseHtml = htmlParser( {
//   isValidNode: node => node.type !== 'script'
// } );

const Document = ( { isAdminPreview, displayAsModal, item } ) => {
  const {
    id,
    published,
    owner,
    site,
    title,
    content,
    logo,
    language,
    documentUrl,
    documentUse,
    tags,
    type,
  } = item;

  const { signedUrl } = useSignedUrl( documentUrl || '' );

  useEffect( () => {
    if ( !displayAsModal ) {
      updateUrl( `/document?id=${id}&site=${site}&language=${language.locale}` );
    }
  }, [] );

  const DownloadElement = isAdminPreview ? 'span' : 'a';

  const setLangAttr = () => {
    if ( language.languageCode ) return language.languageCode;
    if ( language.language_code ) return language.language_code;

    return 'en';
  };

  return (
    <ModalItem headline={ title } className={ isAdminPreview ? 'document--preview' : '' } lang={ setLangAttr() }>
      <div className="modal_options modal_options--noLanguage">
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
        <Popover
          id={ `${id}_document-share` }
          className="document-project__popover document-project__popover--share"
          trigger={ <img src={ shareIcon } style={ { width: '20px', height: '20px' } } alt="share icon" /> }
          expandFromRight
          toolTip="Share document"
        >
          <div className="popup_share">
            <h2 className="ui header">Copy the link to share internally.</h2>
            <Share
              id={ id }
              site={ site }
              title={ title }
              language={ language.locale }
              type={ type }
              {
                ...( isAdminPreview
                  ? { isPreview: true, link: 'The direct link to the package will appear here.' }
                  : {}
                ) }
            />
          </div>
        </Popover>
        <Button className="trigger" tooltip="Not For Public Distribution">
          <DownloadElement
            { ...( isAdminPreview
              ? {}
              : {
                href: signedUrl,
                className: 'trigger',
                download: true,
                rel: 'noopener noreferrer',
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

      { !content && <ModalDescription description="No text available" /> }

      { !isAdminPreview && <ModalDescription description={ content } /> }

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
