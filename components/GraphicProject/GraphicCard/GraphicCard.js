import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getCount } from 'lib/utils';
import { getDateTimeTerms } from 'components/Package/utils';
import { Modal } from 'semantic-ui-react';
import MediaObject from 'components/MediaObject/MediaObject';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import TagsList from 'components/modals/ModalPostTags/ModalPostTags';
import DosSeal from 'static/images/dos_seal.svg';
import { filterGraphicImgs } from '../utils';
import GraphicProject from '../GraphicProject';
import './GraphicCard.scss';

import tempSrcUrl from 'components/download/DownloadItem/graphicPlaceholderImg.png';

const GraphicCard = ( { item } ) => {
  const [isOpen, setIsOpen] = useState( false );
  const handleOpen = () => setIsOpen( true );
  const handleClose = () => setIsOpen( false );

  const {
    id,
    published,
    modified,
    owner,
    descInternal,
    images,
    tags,
  } = item;

  // Filter for Twitter imgs if available || return all imgs
  const filteredGraphicImgs = filterGraphicImgs( images );

  // Filter for first English img || first img
  const setDefaultImg = () => {
    const englishImg = filteredGraphicImgs.find( img => img.language.display_name === 'English' );

    if ( englishImg ) return englishImg;

    return filteredGraphicImgs[0];
  };
  const thumbnailImg = setDefaultImg();

  return (
    <article className="graphic_card">
      <img src={ tempSrcUrl } alt={ thumbnailImg.alt } />
      <Modal
        open={ isOpen }
        onOpen={ handleOpen }
        onClose={ handleClose }
        trigger={ (
          <h2>
            <button
              id={ `graphic_card_trigger_${id}` }
              className="title"
              type="button"
            >
              { thumbnailImg.title }
            </button>
          </h2>
        ) }
        closeIcon
      >
        <Modal.Content
          role="dialog"
          aria-modal="true"
          aria-labelledby={ `graphic_card_trigger_${id}` }
        >
          <GraphicProject item={ item } displayAsModal />
        </Modal.Content>
      </Modal>
      <div className="content">
        <p className="internal-desc">{ descInternal }</p>
        <p>Photo cred: AP Photos</p>
      </div>
      <footer className="meta">
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
            alt: `${owner || 'U.S. Department of State'} seal`,
          } }
        />
      </footer>
    </article>
  );
};

GraphicCard.propTypes = {
  item: PropTypes.object,
};

export default GraphicCard;
