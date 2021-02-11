import React from 'react';
import PropTypes from 'prop-types';
import './TabPanel.scss';

const TabPanel = ( { title, content } ) => (
  <div
    role="tabpanel"
    tabIndex={ 0 }
    aria-labelledby={ `tab_${title}` }
    id={ `panel_${title}` }
    className="content"
  >
    { content }
  </div>
);

TabPanel.propTypes = {
  title: PropTypes.string,
  content: PropTypes.object,
};

export default TabPanel;
