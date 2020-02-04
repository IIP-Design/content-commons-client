import React from 'react';
import PropTypes from 'prop-types';
import MediaObject from 'components/MediaObject/MediaObject';
import './PressSourceMeta.scss';

const PressSourceMeta = ( {
  author, logo, source, releaseType
} ) => (
  <div className="pressSource">
    <MediaObject
      body={ <span className="pressSource_source">{ source || 'U.S. Department of State' }</span> }
      className="seal"
      img={ {
        src: logo,
        alt: `${source || 'U.S. Department of State'} seal`,
        style: { height: '30px', width: '30px' }
      } }
      style={ { marginBottom: '1em' } }
    />
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
