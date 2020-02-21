import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: {
    REACT_APP_GOOGLE_ANALYTICS_ID
  }
} = getConfig();

const Meta = props => (
  <Head>
    <script
      async
      src={ `https://www.googletagmanager.com/gtag/js?id=${REACT_APP_GOOGLE_ANALYTICS_ID}` }
    />
    { /* eslint-disable-next-line */ }
    <script dangerouslySetInnerHTML={ {
      __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push( arguments ); }
      gtag( 'js', new Date() );
      gtag( 'config', '${REACT_APP_GOOGLE_ANALYTICS_ID}', {
        page_path: window.location.pathname,
      } );
    `
    } }
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <meta property="og:site_name" content="Content Commons" />
    <link rel="shortcut icon" href="/static/favicon.ico" />
    <link rel="stylesheet" type="text/css" href="/static/css/nprogress.css" />
    <title>{ props.title }</title>
  </Head>
);

Meta.propTypes = {
  title: PropTypes.string
};

export default Meta;
