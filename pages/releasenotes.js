import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';

import MarkdownPage from 'components/PageTypes/MarkdownPage';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';

const ReleaseNotes = ( { data, error } ) => <MarkdownPage pageTitle="Content Commons Release Notes" data={ data } error={ error } />;

ReleaseNotes.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] ),
};

export default withCachedFetch( ReleaseNotes, config.RELEASENOTES_URL );
