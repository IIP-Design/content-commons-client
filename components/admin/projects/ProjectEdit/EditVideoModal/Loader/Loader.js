import React from 'react';
import propTypes from 'prop-types';

import './Loader.scss';

const Loader = ( { text, height } ) => (
  <div className="commons-loader-container" style={ { height } }>
    <div className="commons-loader-spinner" />
    <p className="commons-loader-text">{ text }</p>
  </div>
);

Loader.propTypes = {
  height: propTypes.string,
  text: propTypes.string
};

Loader.defaultProps = {
  height: 'auto',
  text: ''
};

export default Loader;
