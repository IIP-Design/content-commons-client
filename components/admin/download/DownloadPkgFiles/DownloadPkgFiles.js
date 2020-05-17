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
      { ( !items || items.length < 1 ) && 'There are no files available for download at this time.' }
      { items && items.length > 0 && items.map(
        item => <SignedUrlLink key={ item.id } file={ item } isPreview={ isPreview } />,
      ) }
    </Fragment>
  );
};

DownloadPkgFiles.propTypes = {
  files: PropTypes.array,
  instructions: PropTypes.string,
  isPreview: PropTypes.bool,
};

export default DownloadPkgFiles;
