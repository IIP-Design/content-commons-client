import React from 'react';
import PropTypes from 'prop-types';
import { getCount } from 'lib/utils';
import DocumentCard from 'components/Document/DocumentCard/DocumentCard';

const PackageItem = props => {
  const { file, isAdminPreview } = props;

  if ( !file || !getCount( file ) ) return null;

  return (
    <DocumentCard file={ file } isAdminPreview={ isAdminPreview } />
  );
};

PackageItem.propTypes = {
  file: PropTypes.object,
  isAdminPreview: PropTypes.bool
};

export default PackageItem;
