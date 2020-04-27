import React from 'react';
import PropTypes from 'prop-types';
import './TabTitle.scss';

const TabTitle = ( { title, isActiveTab, handleOnClick } ) => (
  <button
    role="tab"
    aria-selected={ isActiveTab }
    aria-controls={ `panel_${title}` }
    tabIndex={ 0 }
    type="button"
    id={ `tab_${title}` }
    className={ isActiveTab ? 'tab-title active' : 'tab-title' }
    onClick={ handleOnClick }
  >
    { title }
  </button>
);

TabTitle.propTypes = {
  title: PropTypes.string,
  isActiveTab: PropTypes.bool,
  handleOnClick: PropTypes.func
};

export default TabTitle;
