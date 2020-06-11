import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: {
    REACT_APP_GOOGLE_ANALYTICS_ID,
  },
} = getConfig();

const Meta = ( { title } ) => (
  <Head>
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={ {
        __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=${REACT_APP_GOOGLE_ANALYTICS_ID}&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NTQJVZD');
      `,
      } }
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charSet="utf-8" />
    <meta property="og:site_name" content="Content Commons" />
    <link rel="shortcut icon" href="/static/favicon.ico" />
    <link rel="stylesheet" type="text/css" href="/static/css/nprogress.css" />
    <title>{ title }</title>
  </Head>
);

Meta.propTypes = {
  title: PropTypes.string,
};

export default Meta;
