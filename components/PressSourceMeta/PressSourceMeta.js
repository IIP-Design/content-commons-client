import React from 'react';
import PropTypes from 'prop-types';
import './PressSourceMeta.scss';

const PressSourceMeta = ( {
  author, logo, source, releaseType
} ) => (
  <div className="pressSource">
    <div className="pressSource_logo">
      <img src={ logo } alt={ source } />
      <p>U.S. Department of State</p>
    </div>
    <span className="pressSource_content">Release Type: { releaseType }</span>
    { /* Author displayed only on Dashboard */ }
    { author && (
      <span className="pressSource_content">{ `Author: ${author.firstName} ${author.lastName}` }</span>
    ) }
    <span className="pressSource_content">Source: { source }</span>
  </div>
);

PressSourceMeta.propTypes = {
  author: PropTypes.object,
  logo: PropTypes.string,
  source: PropTypes.string,
  releaseType: PropTypes.string,
};

export default PressSourceMeta;
