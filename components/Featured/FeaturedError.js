import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

const FeaturedError = ( { type } ) => (
  <div style={ { padding: '5rem 2rem', textAlign: 'center' } }>
    <Message>
      { `Oops, something went wrong. We are unable to load the most recent ${type}.`}
    </Message>
  </div>
);

FeaturedError.propTypes = {
  type: PropTypes.string,
};

export default FeaturedError;
