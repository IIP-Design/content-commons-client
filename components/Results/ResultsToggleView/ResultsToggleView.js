import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { isMobile } from 'lib/browser';
import styles from './ResultsToggleView.module.scss';
import 'styles/tooltip.scss';

const ResultsToggleView = ( { currentView, toggle } ) => {
  const [isMobileDevice, setIsMobileDevice] = useState( null );
  const galleryBtn = useRef( null );
  const listBtn = useRef( null );

  useEffect( () => setIsMobileDevice( isMobile() ) );

  const handleFocus = e => {
    const btnRef = e.target.dataset.view === 'gallery' ? listBtn : galleryBtn;

    btnRef.current.focus();
  };

  const handleClick = e => {
    if ( e.target.getAttribute( 'tabindex' ) === null ) {
      toggle( e );
      handleFocus( e );
    }
  };

  return (
    <div className={ styles.toggleView } aria-label="set gallery/list view">
      <VisuallyHidden>
        <div role="status" aria-live="polite">{ `current view is ${currentView}` }</div>
      </VisuallyHidden>
      <button
        type="button"
        onClick={ handleClick }
        { ...( currentView === 'gallery'
          ? { tabIndex: -1, 'aria-hidden': true }
          : {} ) }
        data-view="gallery"
        ref={ galleryBtn }
      >
        <VisuallyHidden>set to gallery view</VisuallyHidden>
        <span
          aria-hidden="true"
          className={ isMobileDevice ? styles.noTooltip : '' }
          tooltip="Gallery View"
        >
          <Icon
            name="grid layout"
            className={ currentView === 'gallery' ? styles.active : '' }
          />
        </span>
      </button>

      <button
        type="button"
        onClick={ handleClick }
        { ...( currentView === 'list'
          ? { tabIndex: -1, 'aria-hidden': true }
          : {} ) }
        data-view="list"
        ref={ listBtn }
      >
        <VisuallyHidden>set to list view</VisuallyHidden>
        <span
          aria-hidden="true"
          className={ isMobileDevice ? styles.noTooltip : '' }
          tooltip="List View"
        >
          <Icon
            name="list"
            className={ currentView === 'list' ? styles.active : '' }
          />
        </span>
      </button>
    </div>
  );
};

ResultsToggleView.propTypes = {
  toggle: PropTypes.func,
  currentView: PropTypes.string,
};

export default ResultsToggleView;
