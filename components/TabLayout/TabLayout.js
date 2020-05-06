import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import TabTitle from './TabTitle/TabTitle';
import TabPanel from './TabPanel/TabPanel';

import './TabLayout.scss';

const TabLayout = ( { headline, tabs } ) => {
  const [active, setActive] = useState( `tab_${tabs[0].title}` );
  const [sliderStyle, setSliderStyle] = useState( {} );

  useEffect( () => {
    const activeTab = document.querySelector( '.tab-title.active' );
    const width = activeTab.clientWidth;
    const left = activeTab.offsetLeft;

    setSliderStyle( { width, left } );
  }, [active] );

  const handleOnClick = ( { target } ) => {
    setActive( target.id );
  };

  const tabTitles = tabs.map( tab => tab.title );

  return (
    <div className="tab-layout">
      <h3 className="tab-layout__headline">{ headline }</h3>
      <div className="tabs" role="tablist" aria-label="Tabs List">
        <section className="tabs__titles">
          { tabTitles.map( title => {
            const isActiveTab = active === `tab_${title}`;

            return (
              <TabTitle
                key={ `tab_${title}` }
                title={ title }
                isActiveTab={ isActiveTab }
                handleOnClick={ handleOnClick }
              />
            );
          } ) }
          <div className="slider" style={ sliderStyle } />
        </section>
        <section className="tabs__content">
          { tabs.map( tab => {
            const { title, content } = tab;
            const tabIndex = `tab_${title}`;
            const isActiveTab = active === tabIndex;

            return isActiveTab && <TabPanel key={ `panel_${title}` } title={ title } content={ content } />;
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
