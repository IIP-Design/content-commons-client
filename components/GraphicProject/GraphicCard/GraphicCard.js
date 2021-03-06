import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import useSignedUrl from 'lib/hooks/useSignedUrl';
import { getCount } from 'lib/utils';
import { Modal } from 'semantic-ui-react';

import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';
import MediaObject from 'components/MediaObject/MediaObject';
import TagsList from 'components/modals/ModalPostTags/ModalPostTags';

import DosSeal from 'static/images/dos_seal.svg';
import logoShareAmerica from 'static/images/logo_shareamerica.svg';

import { getGraphicImgsBySocial } from '../utils';
import GraphicProject from '../GraphicProject';
import './GraphicCard.scss';

const GraphicCard = ( { item } ) => {
  const [isOpen, setIsOpen] = useState( false );
  const handleOpen = () => setIsOpen( true );
  const handleClose = () => setIsOpen( false );

  const {
    id,
    published,
    owner,
    title,
    descPublic,
    images,
    categories,
    icon,
    visibility,
  } = item;

  // Filter for Twitter imgs if available || return all imgs
  const filteredGraphicImgs = getGraphicImgsBySocial( images, 'Twitter' );

  // Filter for first English img || first img
  const setDefaultImg = () => {
    const englishImg = filteredGraphicImgs.find( img => img.language.display_name === 'English' );

    if ( englishImg ) return englishImg;

    return filteredGraphicImgs[0];
  };
  const thumbnailImg = setDefaultImg();

  // Get signed url for image
  const { signedUrl } = useSignedUrl( thumbnailImg.url );

  return (
    <article className="graphic_card">
      <Modal
        open={ isOpen }
        onOpen={ handleOpen }
        onClose={ handleClose }
        trigger={ (
          <div className="graphic_card_thumbnail">
            <img src={ signedUrl } alt={ thumbnailImg.alt } data-img="graphic_thumbnail" />
            <img src={ icon } className="graphic_icon" alt="graphic card icon" />
          </div>
        ) }
      >
        <Modal.Content
          role="dialog"
          aria-modal="true"
        >
          <GraphicProject item={ item } displayAsModal />
        </Modal.Content>
      </Modal>

      { visibility === 'INTERNAL' && <InternalUseDisplay style={ { margin: '0.5em auto 0 1em' } } /> }

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
              { title }
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
        <p className="publicDesc">{ descPublic?.content || '' }</p>
      </div>
      <footer className="meta">
        <span className="publishedDate">{ `${moment( published ).format( 'MMMM DD, YYYY' )}` }</span>

        { getCount( categories ) > 0 && <TagsList tags={ categories } /> }

        { owner === 'ShareAmerica'
          ? (
            <img
              src={ logoShareAmerica }
              alt={ `${owner} logo` }
              className="ShareAmerica-logo"
              /**
               * Set height here instead of in stylesheet
               * to avoid the logo resizing and layout
               * shift when the page is loaded
               */
              height="20"
            />
          )
          : (
            <MediaObject
              body={ <span>{ owner || 'U.S. Department of State' }</span> }
              className="seal"
              img={ {
                src: DosSeal,
                alt: `${owner || 'U.S. Department of State'} seal`,
              } }
            />
          ) }
      </footer>
    </article>
  );
};

GraphicCard.propTypes = {
  item: PropTypes.object,
};

export default GraphicCard;
