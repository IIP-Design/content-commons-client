import React from 'react';
import PropTypes from 'prop-types';
import config from '../config';
import withCachedFetch from '../hocs/withCachedFetch';
import MarkdownPage from '../components/MarkdownPage';


const About = props => {
  const { data, error } = props;
  return (
    <MarkdownPage pageTitle="About Content Commons" data={ data } error={ error } />
  );
};


About.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default withCachedFetch( About, config.ABOUT_URL );
