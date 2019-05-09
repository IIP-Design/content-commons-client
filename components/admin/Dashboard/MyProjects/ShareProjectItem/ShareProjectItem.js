import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Popup } from 'semantic-ui-react';
import ClipboardCopy from 'components/ClipboardCopy';
import './ShareProjectItem.scss';

const ShareProjectItem = props => {
  const { id, windowWidth } = props;
  const [sharePopupOpen, setSharePopupOpen] = useState( false );

  const handleResize = debounce( () => {
    handleClose();
  }, 50, { leading: false, trailing: true } );

  const handleTableScroll = debounce( () => {
    handleClose();
  }, 500, { leading: true, trailing: false } );

  const handleOpen = () => {
    setSharePopupOpen( true );
    window.addEventListener( 'resize', handleResize );

    const itemsTable = document.querySelector( '.items_table' );
    itemsTable.addEventListener( 'scroll', handleTableScroll );
  };

  const handleClose = () => {
    setSharePopupOpen( false );
    window.removeEventListener( 'resize', handleResize );

    const itemsTable = document.querySelector( '.items_table' );
    itemsTable.removeEventListener( 'scroll', handleTableScroll );
  };

  const [projectReviewURL, setProjectReviewURL] = useState( '' );
  useEffect( () => {
    const { protocol, host } = window.location;
    const link = `${protocol}//${host}/admin/project/video/${id}/review`;
    setProjectReviewURL( link );
  } );

  return (
    <Popup
      className="shareLink_popup"
      trigger={ (
        <button
          type="button"
          className="linkStyle myProjects_data_actions_action"
          data-projectitempopup="sharePopup"
        >
          Share
        </button>
      ) }
      content={ <ClipboardCopy label="Direct Link" copyItem={ projectReviewURL } /> }
      on="click"
      position={ windowWidth <= 767 ? 'bottom right' : 'bottom center' }
      hideOnScroll
      keepInViewPort={ false }
      open={ sharePopupOpen }
      onOpen={ handleOpen }
      onClose={ handleClose }
    />
  );
};

ShareProjectItem.propTypes = {
  id: PropTypes.string,
  windowWidth: PropTypes.number
};

export default ShareProjectItem;
