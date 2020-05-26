import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import { Header, Image } from 'semantic-ui-react';
import NProgress from 'nprogress';
import DosSeal from 'static/images/dos_seal.svg';
import SearchInput from 'components/SearchInput/SearchInput';
import GlobalNav from '../navs/global';
import './Header.scss';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const HeaderGlobal = ( { router } ) => {
  const pagePath = router.pathname.split( '/' ).slice( 1 );
  const isHome = pagePath[0] === '';
  const barClass = `bar ${isHome ? 'bar--home' : pagePath.map( path => `bar--${path}` ).join( ' ' )}`;

  return (
    <div className={ barClass }>
      <div className="ui container">
        <header>
          <Header as="h1">
            <div>
              <Image className="seal" src={ DosSeal } centered alt="Department of State Seal" />
              <Link href="/"><a className="title">Content Commons</a></Link>
            </div>
            <Header.Subheader className="subtitle">Making it easier to find public diplomacy content</Header.Subheader>
            <Header.Subheader className="subtext">
              Content Commons is a U.S. Department of State portal helping public diplomacy practitioners find what they need.
            </Header.Subheader>
          </Header>
          <SearchInput />
          <GlobalNav />
        </header>
      </div>
    </div>
  );
};

HeaderGlobal.propTypes = {
  router: PropTypes.object,
};

export default withRouter( HeaderGlobal );
