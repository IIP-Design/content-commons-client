import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import ClipboardCopy from 'components/ClipboardCopy';
import './ShareProjectItem.scss';

const ShareProjectItem = props => {
  const [windowWidth, setWindowWidth] = useState( 0 );
  const [sharePopupOpen, setSharePopupOpen] = useState( false );

  useEffect( () => {
    const handleResize = () => {
      setWindowWidth( isWindowWidthLessThanOrEqualTo( 400 ) );
      setSharePopupOpen( false );
    };
    window.addEventListener( 'resize', handleResize );

    const itemsTable = document.querySelector( '.items_table' );
    const handleTableScroll = () => setSharePopupOpen( false );
    itemsTable.addEventListener( 'scroll', handleTableScroll );

    return () => {
      window.removeEventListener( 'resize', handleResize );
      itemsTable.removeEventListener( 'scroll', handleTableScroll );
    };
  } );

  const { id } = props;
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
      position={ windowWidth <= 400 ? 'bottom right' : 'bottom center' }
      hideOnScroll
      keepInViewPort={ false }
      open={ sharePopupOpen }
      onOpen={ () => setSharePopupOpen( true ) }
      onClose={ () => setSharePopupOpen( false ) }
    />
  );
};

ShareProjectItem.propTypes = {
  id: PropTypes.string
};

export default ShareProjectItem;
