import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Meta from './Meta';
import { capitalizeFirst } from '../lib/utils';

const Page = props => {
  // Set padding on main elem dynamically so footer is always at bottom of page and under content
  const [mainElemPadding, setMainElemPadding] = useState( 72 );

  useEffect( () => {
    const footerHeight = document.querySelector( 'footer' ).getBoundingClientRect().height;
    setMainElemPadding( prevState => Math.round( prevState + footerHeight ) );
  }, [] );

  const { router } = props;
  const { pathname } = router;

  let path = pathname.substr( router.pathname.lastIndexOf( '/' ) + 1 );
  // if on a dynamic page, i.e. admin/package/[id] then get the page title
  // from one level up, 'package'
  if ( path.indexOf( '[' ) !== -1 ) {
    const parts = pathname.split( '/' );
    path = parts[parts.length - 2];
  }
  const title = path ? `${capitalizeFirst( path )} | Content Commons` : 'Content Commons';
  const bodyCls = ( pathname === '/' ) ? '' : 'ui container inside';

  return (
    <div style={ { position: 'relative', minHeight: '100vh' } }>
      <Meta title={ title } />
      <Header />
      <main className={ bodyCls } style={ { paddingBottom: `${mainElemPadding}px` } }>
        { props.children }
      </main>
      <Footer />
    </div>
  );
};


Page.propTypes = {
  children: PropTypes.node,
  router: PropTypes.object
};


export default withRouter( Page );
