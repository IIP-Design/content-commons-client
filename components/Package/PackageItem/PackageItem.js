import React from 'react';
import PropTypes from 'prop-types';

import DocumentCard from 'components/Document/DocumentCard/DocumentCard';
import { getCount } from 'lib/utils';

const PackageItem = ( { file, isAdminPreview } ) => {
  if ( !file || !getCount( file ) ) return null;

  return (
    <DocumentCard file={ file } isAdminPreview={ isAdminPreview } />
  );
};

PackageItem.propTypes = {
  file: PropTypes.object,
  isAdminPreview: PropTypes.bool,
};

export default PackageItem;
