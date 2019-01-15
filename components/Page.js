import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import Meta from './Meta';
import { capitalizeFirst } from '../lib/utils';

class Page extends Component {
  render() {
    const { router } = this.props;

    const path = router.pathname.substr( router.pathname.lastIndexOf( '/' ) + 1 );
    const title = ( path ) ? `${capitalizeFirst( path )} | Content Commons` : 'Content Commons';
    const bodyCls = ( router.pathname === '/' ) ? '' : 'inside';

    return (
      <div>
        <Meta title={ title } />
        <Header />
        <main className={ `ui container ${bodyCls}` }>{ this.props.children }</main>
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
