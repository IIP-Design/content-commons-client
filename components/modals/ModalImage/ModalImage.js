import React from 'react';
import PropTypes from 'prop-types';

import useSignedUrl from 'lib/hooks/useSignedUrl';

import './ModalImage.scss';

const ModalImage = ( { thumbnail, thumbnailMeta } ) => {
  const { signedUrl } = useSignedUrl( thumbnail );

  return (
    <figure className="modal_thumbnail">
      <img src={ signedUrl } alt={ thumbnailMeta.alt } />
      <figcaption className="modal_meta_content">{ thumbnailMeta.caption }</figcaption>
    </figure>
  );
};

ModalImage.propTypes = {
  thumbnail: PropTypes.string,
  thumbnailMeta: PropTypes.object,
};

export default ModalImage;
