import React from 'react';
import { func, string } from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { isMobile } from 'lib/browser';
import './ResultsToggleView.scss';
import 'styles/tooltip.scss';

const ResultsToggleView = props => (
  <div className="results_toggleView">
    <span tooltip="Gallery View" className={ isMobile() ? 'noTooltip' : '' }>
      <Icon
        name="grid layout"
        data-view="gallery"
        onClick={ props.toggle }
        className={ props.currentView === 'gallery' ? 'active' : '' }
      />
    </span>
    <span tooltip="List View" className={ isMobile() ? 'noTooltip' : '' }>
      <Icon
        name="list"
        data-view="list"
        onClick={ props.toggle }
        className={ props.currentView === 'list' ? 'active' : '' }
      />
    </span>
  </div>
);

ResultsToggleView.propTypes = {
  toggle: func,
  currentView: string
};

export default ResultsToggleView;
