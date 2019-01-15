import React from 'react';
import PropTypes from 'prop-types';
import config from '../config';
import withCachedFetch from '../hocs/withCachedFetch';
import MarkdownPage from '../components/MarkdownPage';


const Contact = props => {
  const { data, error } = props;
  return (
    <MarkdownPage pageTitle="Contact Us" data={ data } error={ error } />
  );
};


Contact.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default withCachedFetch( Contact, config.CONTACT_URL );
