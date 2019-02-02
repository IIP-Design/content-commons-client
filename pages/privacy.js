import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';
import MarkdownPage from 'components/MarkdownPage';


const Privacy = props => {
  const { data, error } = props;
  return (
    <MarkdownPage pageTitle="Privacy Policy" data={ data } error={ error } />
  );
};


Privacy.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default withCachedFetch( Privacy, config.PRIVACY_URL );
