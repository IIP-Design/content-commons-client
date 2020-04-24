import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TabLayout.scss';

const TabLayout = ( { headline, tabs } ) => {
  const [active, setActive] = useState( 'tab_0' );

  const handleOnClick = ( { target } ) => {
    setActive( target.id );
  };

  const tabTitles = tabs.map( tab => tab.title );
  const tabContent = tabs.map( tab => tab.content );

  return (
    <div className="tab-layout">
      <h3 className="tab-layout__headline">{ headline }</h3>
      <div className="tabs" role="tablist" aria-label="Tabs List">
        <section className="tabs__titles">
          { tabTitles.map( ( title, index ) => {
            const isActiveTab = active === `tab_${index}`;

            return (
              <button
                role="tab"
                aria-selected={ isActiveTab }
                aria-controls={ `panel_${index}` }
                tabIndex={ 0 }
                type="button"
                key={ title }
                id={ `tab_${index}` }
                className={ isActiveTab ? 'tab-title active' : 'tab-title' }
                onClick={ handleOnClick }
              >
                { title }
              </button>
            );
          } ) }
        </section>
        <section className="tabs__content">
          { tabContent.map( ( content, index ) => {
            const tabIndex = `tab_${index}`;
            const isActiveTab = active === tabIndex;

            return isActiveTab && (
              <div
                role="tabpanel"
                tabIndex={ 0 }
                aria-labelledby={ `tab_${index}` }
                key={ `panel_${index}` }
                id={ `panel_${index}` }
                className="content"
              >
                { content }
              </div>
            );
          } ) }
        </section>
      </div>
    </div>
  );
};

TabLayout.propTypes = {
  headline: PropTypes.string,
  tabs: PropTypes.array
};

export default TabLayout;
