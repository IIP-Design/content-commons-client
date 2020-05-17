import React from 'react';
import PropTypes from 'prop-types';

import useSignedUrl from 'lib/hooks/useSignedUrl';

const SignedUrlImage = ( { children, classes, url, ...rest } ) => {
  const { signedUrl } = useSignedUrl( url );

  return (
    <div
      className={ classes }
      style={ { backgroundImage: `url( ${signedUrl} )` } }
      { ...rest }
    >
      {children}
    </div>
  );
};

SignedUrlImage.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.string,
  url: PropTypes.string,
};


export default SignedUrlImage;
