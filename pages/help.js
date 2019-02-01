import React from 'react';
import PropTypes from 'prop-types';
import config from '../config';
import withCachedFetch from '../hocs/withCachedFetch/withCachedFetch';
import MarkdownPage from '../components/MarkdownPage';


const Help = props => {
  const { data, error } = props;
  return (
    <MarkdownPage
      pageTitle="Help"
      pageSubTitle="Common questions and solutions for Content Commons."
      data={ data }
      error={ error }
    />
  );
};


Help.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default withCachedFetch( Help, config.HELP_URL );
