import React from 'react';
import PropTypes from 'prop-types';
import './PressSourceMeta.scss';

const PressSourceMeta = ( { logo, source, releaseType } ) => (
  <div className="pressSource">
    <div className="pressSource_logo">
      <img src={ logo } alt={ source } />
      <p>U.S. Department of State</p>
    </div>
    <span className="pressSource_content">Release Type: { releaseType }</span>
    <span className="pressSource_content">Source: { source }</span>
  </div>
);

PressSourceMeta.propTypes = {
  logo: PropTypes.string,
  source: PropTypes.string,
  releaseType: PropTypes.string,
};

export default PressSourceMeta;
