import React from 'react';
import PropTypes from 'prop-types';
import './MediaObject.scss';

const MediaObject = props => {
  const {
    body, className, el: Element, img, style
  } = props;

  return (
    <Element className={ `media ${className}` } style={ style }>
      <img
        className={ `media-figure ${img.className ? img.className : ''}` }
        src={ img.src }
        alt={ img.alt }
        style={ img.style }
      />
      { body }
    </Element>
  );
};

MediaObject.defaultProps = {
  body: <p />,
  className: '',
  el: 'div',
  img: {
    src: '',
    alt: '',
    className: '',
    style: {}
  },
  style: {}
};

MediaObject.propTypes = {
  body: PropTypes.node,
  className: PropTypes.string,
  el: PropTypes.string,
  img: PropTypes.shape( {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  } ),
  style: PropTypes.object
};

export default MediaObject;
