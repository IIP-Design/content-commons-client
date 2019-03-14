import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';

const Meta = props => (
  <Head>
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
