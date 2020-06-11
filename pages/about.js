import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';

import MarkdownPage from 'components/PageTypes/MarkdownPage';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';

const About = ( { data, error } ) => <MarkdownPage pageTitle="About Content Commons" data={ data } error={ error } />;

About.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] ),
};

export default withCachedFetch( About, config.ABOUT_URL );
