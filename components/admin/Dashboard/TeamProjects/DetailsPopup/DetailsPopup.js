import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import { Popup } from 'semantic-ui-react';
import './DetailsPopup.scss';

const VideoDetailsPopup = dynamic( () => import( './VideoDetailsPopup' ) );
const PackageDetailsPopup = dynamic( () => import( './PackageDetailsPopup' ) );

const DetailsPopup = props => {
  const { id, team } = props;
  const [detailsPopupOpen, setDetailsPopupOpen] = useState( false );

  /**
   * Handle popup behavior on scroll instead of native Popup component hideOnScroll prop
   * Allows to scroll popup (Files) w/ scrollbars w/o immediately closing
   */
  useEffect( () => {
    const handlePopupScroll = () => setDetailsPopupOpen( false );
    window.addEventListener( 'scroll', handlePopupScroll );
    return () => window.removeEventListener( 'scroll', handlePopupScroll );
  }, [] );

  /**
   * Handle memory leak with set state fn call
   * (i.e., setDetailsPopupOpen) on unmounted component.
   */
  let isMounted = true;
  useEffect( () => () => { isMounted = false; }, [] );

  const handleResize = debounce( () => {
    /* eslint-disable no-use-before-define */
    handleClose();
  }, 500, { leading: true, trailing: false } );

  const handleOpen = () => {
    setDetailsPopupOpen( true );
    window.addEventListener( 'resize', handleResize );
  };

  const handleClose = () => {
    window.removeEventListener( 'resize', handleResize );
    const itemsTable = document.querySelector( '.items_table' );
    if ( itemsTable && isMounted ) {
      setDetailsPopupOpen( false );
    }
  };

  const renderPopup = () => {
    const { contentTypes } = team;
    if ( contentTypes.includes( 'VIDEO' ) ) return <VideoDetailsPopup id={ id } />;
    if ( contentTypes.includes( 'PACKAGE' ) ) return <PackageDetailsPopup id={ id } />;
  };

  return (
    // 06/10/19 - Updating button text from "Details" to "Files"
    // if DetailsPopup will contain content other than files in future,
    // will add conditional to display "Details" text along with "Files"/"Other Content"
    // subheaders within popup
    <Popup
      className="detailsFiles_popup"
      trigger={ (
        <button
          type="button"
          className="linkStyle projects_data_actions_action"
          data-projectitempopup="detailsPopup"
        >
          Files
        </button>
      ) }
      content={ renderPopup( id ) }
      on="click"
      position="bottom left"
      open={ detailsPopupOpen }
      onOpen={ handleOpen }
      onClose={ handleClose }
    />
  );
};

DetailsPopup.propTypes = {
  id: PropTypes.string,
  team: PropTypes.object,
};

export default DetailsPopup;
