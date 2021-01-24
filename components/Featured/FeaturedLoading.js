import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';

const FeaturedLoading = ( { loading } ) => (
  <div style={ { padding: '5rem 2rem' } }>
    <Loader active={ loading } inline="centered" />
  </div>
);

FeaturedLoading.propTypes = {
  loading: PropTypes.bool,
};

export default FeaturedLoading;
