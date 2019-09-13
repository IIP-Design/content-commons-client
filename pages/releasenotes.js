import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';
import MarkdownPage from 'components/MarkdownPage';


const ReleaseNotes = props => {
  const { data, error } = props;
  return (
    <MarkdownPage pageTitle="Content Commons Release Notes" data={ data } error={ error } />
  );
};


ReleaseNotes.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default withCachedFetch( ReleaseNotes, config.RELEASENOTES_URL );
