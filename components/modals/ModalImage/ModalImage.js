import React from 'react';
import PropTypes from 'prop-types';

import './ModalImage.scss';

const ModalImage = ( { thumbnail, thumbnailMeta } ) => (
  <figure className="modal_thumbnail">
    <img src={ thumbnail } alt={ thumbnailMeta.alt } />
    <figcaption className="modal_meta_content">{ thumbnailMeta.caption }</figcaption>
  </figure>
);

ModalImage.propTypes = {
  thumbnail: PropTypes.string,
  thumbnailMeta: PropTypes.object,
};

export default ModalImage;
