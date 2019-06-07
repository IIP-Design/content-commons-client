import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Meta from './Meta';
import { capitalizeFirst } from '../lib/utils';


const Page = props => {
  const { router } = props;
  const { pathname } = router;
  const path = pathname.substr( router.pathname.lastIndexOf( '/' ) + 1 );
  const title = ( path ) ? `${capitalizeFirst( path )} | Content Commons` : 'Content Commons';
  const bodyCls = ( pathname === '/' ) ? '' : 'inside';

  return (
    <div>
      <Meta title={ title } />
      <Header />
      <main className={ `ui container ${bodyCls}` }>
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
