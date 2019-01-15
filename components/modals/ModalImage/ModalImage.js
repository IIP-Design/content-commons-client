import React from 'react';
import { object, string } from 'prop-types';
import './ModalImage.scss';

const ModalImage = props => {
  const { thumbnail, thumbnailMeta } = props;
  return (
    <figure className="modal_thumbnail">
      <img src={ thumbnail } alt={ thumbnailMeta.alt } />
      <figcaption className="modal_meta_content">{ thumbnailMeta.caption }</figcaption>
    </figure>
  );
};

ModalImage.propTypes = {
  thumbnail: string,
  thumbnailMeta: object
};

export default ModalImage;
