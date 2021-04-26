import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { isMobile } from 'lib/browser';
import './ResultsToggleView.scss';
import 'styles/tooltip.scss';

const ResultsToggleView = ( { currentView, toggle } ) => {
  const [isMobileDevice, setIsMobileDevice] = useState( null );

  useEffect( () => setIsMobileDevice( isMobile() ) );

  return (
    <div className="results_toggleView" aria-label="set gallery/list view">
      <VisuallyHidden>
        <div role="status" aria-live="polite">{ `${currentView} view` }</div>
      </VisuallyHidden>
      <button
        type="button"
        onClick={ toggle }
        disabled={ currentView === 'gallery' }
        data-view="gallery"
      >
        <VisuallyHidden>set to gallery view</VisuallyHidden>
        <span
          aria-hidden="true"
          className={ isMobileDevice ? 'noTooltip' : '' }
          tooltip="Gallery View"
        >
          <Icon
            name="grid layout"
            className={ currentView === 'gallery' ? 'active' : '' }
          />
        </span>
      </button>

      <button
        type="button"
        onClick={ toggle }
        disabled={ currentView === 'list' }
        data-view="list"
      >
        <VisuallyHidden>set to list view</VisuallyHidden>
        <span
          aria-hidden="true"
          className={ isMobileDevice ? 'noTooltip' : '' }
          tooltip="List View"
        >
          <Icon
            name="list"
            className={ currentView === 'list' ? 'active' : '' }
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
