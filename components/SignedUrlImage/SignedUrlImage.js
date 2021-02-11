import React from 'react';
import PropTypes from 'prop-types';

import useSignedUrl from 'lib/hooks/useSignedUrl';

const SignedUrlImage = ( { children, url, ...rest } ) => {
  const { signedUrl } = useSignedUrl( url );

  return (
    <div
      style={ { backgroundImage: `url( ${signedUrl} )` } }
      { ...rest }
    >
      { children }
    </div>
  );
};

SignedUrlImage.propTypes = {
  children: PropTypes.node,
  url: PropTypes.string,
};


export default SignedUrlImage;
