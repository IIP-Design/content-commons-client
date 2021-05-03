import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import { Header } from 'semantic-ui-react';
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

const HeaderGlobal = ( { router: { pathname } } ) => {
  const pagePath = pathname.split( '/' ).slice( 1 );
  const isHome = pagePath[0] === '';
  const barClass = `bar ${isHome ? 'bar--home' : pagePath.map( path => `bar--${path}` ).join( ' ' )}`;
  const imgDimensions = isHome ? 60 : 34;

  // const showSearchInput = _pathname => ( ( _pathname === '/' || _pathname !== '/results' ) ? <SearchInput /> : null );

  return (
    <div className={ barClass }>
      <div className="ui container">
        <header role="banner">
          <Header as="h1">
            <div>
              <img
                src={ DosSeal }
                alt="Department of State Seal"
                height={ imgDimensions }
                width={ imgDimensions }
                className="ui centered image seal"
              />
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
