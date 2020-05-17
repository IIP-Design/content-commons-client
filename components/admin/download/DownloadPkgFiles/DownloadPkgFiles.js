import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import SignedUrlLink from './SignedUrlLink/SignedUrlLink';

const DownloadPkgFiles = ( { files, instructions, isPreview } ) => {
  const items = files.reduce( ( acc, file ) => {
    if ( file && file.url ) {
      acc.push( file );
    }

    return acc;
  }, [] );

  return (
    <Fragment>
      <p className="form-group_instructions">{ instructions }</p>
      { items.length && items.map( item => <SignedUrlLink key={ item.id } file={ item } isPreview={ isPreview } /> ) }
    </Fragment>
  );
};

DownloadPkgFiles.propTypes = {
  files: PropTypes.array,
  instructions: PropTypes.string,
  isPreview: PropTypes.bool,
};

export default DownloadPkgFiles;
