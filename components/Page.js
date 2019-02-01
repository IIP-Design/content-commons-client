import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Meta from './Meta';
import { capitalizeFirst } from '../lib/utils';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';

class Page extends Component {
  doNotShowBreadcrumbs = [
    '/', '/login', '/confirm', '/_error', '/passwordreset'
  ]

  render() {
    const { router } = this.props;

    const { pathname } = router;
    const path = pathname.substr( router.pathname.lastIndexOf( '/' ) + 1 );
    const title = ( path ) ? `${capitalizeFirst( path )} | Content Commons` : 'Content Commons';
    const bodyCls = ( pathname === '/' ) ? '' : 'inside';
    const hideBreadcrumbs = this.doNotShowBreadcrumbs.includes( pathname );

    return (
      <div>
        <Meta title={ title } />
        <Header />
        <main className={ `ui container ${bodyCls}` }>
          { !hideBreadcrumbs && <Breadcrumbs /> }
          { this.props.children }
        </main>
        <Footer />
      </div>
    );
  }
}


Page.propTypes = {
  children: PropTypes.node,
  router: PropTypes.object
};


export default withRouter( Page );
