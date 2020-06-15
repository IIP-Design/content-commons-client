import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';

import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';
import MarkdownPage from 'components/PageTypes/MarkdownPage/MarkdownPage';

const Contact = ( { data, error } ) => <MarkdownPage pageTitle="Contact Us" data={ data } error={ error } />;

Contact.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] ),
};

export default withCachedFetch( Contact, config.CONTACT_URL );
