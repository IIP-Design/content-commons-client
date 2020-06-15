import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';

import MarkdownPage from 'components/PageTypes/MarkdownPage/MarkdownPage';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';

const Privacy = ( { data, error } ) => <MarkdownPage pageTitle="Privacy Policy" data={ data } error={ error } />;

Privacy.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] ),
};

export default withCachedFetch( Privacy, config.PRIVACY_URL );
