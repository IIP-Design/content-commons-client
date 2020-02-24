import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Card } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import { getDateTimeTerms } from 'components/Package/utils';

import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';
import MediaObject from 'components/MediaObject/MediaObject';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import TagsList from 'components/modals/ModalPostTags/ModalPostTags';

import DosSeal from 'static/images/dos_seal.svg';
import iconDocument from 'static/icons/icon_32px_document-white.png';

import { hasCssSupport } from 'lib/browser';
import { getCount } from 'lib/utils';
import Document from '../Document';

import './DocumentCard.scss';

const DocumentCard = props => {
  const { isAdminPreview, file: doc } = props;
  const [isOpen, setIsOpen] = useState( false );

  if ( !doc || !getCount( doc ) ) return null;

  const handleOpen = () => setIsOpen( true );
  const handleClose = () => setIsOpen( false );

  const {
    id,
    published,
    modified,
    title,
    documentUse,
    excerpt,
    tags,
    owner,
  } = doc;

  // disallow <script></script> tags
  const parseHtml = htmlParser( {
    isValidNode: node => node.type !== 'script'
  } );

  return (
    <Card
      key={ id }
      className="document_card"
      { ...( hasCssSupport( 'display', 'grid' )
        ? { fluid: true }
        : { centered: true } ) }
    >
      <article className="container">
        <MediaObject
          className="document-use"
          body={ <span>{ documentUse }</span> }
          img={ {
            src: iconDocument,
            alt: 'document icon',
            style: { height: '30px', width: '30px' }
          } }
        />

        <InternalUseDisplay />

        <Card.Header as="header">
          <Modal
            open={ isOpen }
            onOpen={ handleOpen }
            onClose={ handleClose }
            trigger={ (
              <button
                id="documentCard_trigger"
                className="title"
                type="button"
                aria-haspopup="true"
                aria-expanded={ isOpen }
                aria-controls="documentCard_content"
              >
                { title || 'DOCUMENT' }
              </button>
            ) }
            closeIcon
          >
            <Modal.Content id="documentCard_content" aria-modal="true" aria-labelledby="documentCard_trigger" aria-hidden={ !isOpen }>
              <Document item={ doc } displayAsModal isAdminPreview={ isAdminPreview } />
            </Modal.Content>
          </Modal>
        </Card.Header>

        <Card.Content>
          { excerpt
            ? (
              <Fragment>
                <p>Excerpt:</p>
                <ReactMarkdown
                  className="excerpt"
                  source={ excerpt }
                  escapeHtml={ false }
                  astPlugins={ [parseHtml] }
                />
              </Fragment>
            )
            : <p>No excerpt available</p> }
        </Card.Content>

        <Card.Meta as="footer">
          <MetaTerms
            className="date-time"
            unitId={ id }
            terms={ getDateTimeTerms( published, modified, 'LL' ) }
          />

          { getCount( tags ) > 0 && <TagsList tags={ tags } /> }

          <MediaObject
            body={ <span>{ owner || 'U.S. Department of State' }</span> }
            className="seal"
            img={ {
              src: DosSeal,
              alt: `${owner || 'U.S. Department of State'} seal`
            } }
          />
        </Card.Meta>
      </article>
    </Card>
  );
};

DocumentCard.propTypes = {
  isAdminPreview: PropTypes.bool,
  file: PropTypes.object,
  handleClick: PropTypes.func
};

export default DocumentCard;