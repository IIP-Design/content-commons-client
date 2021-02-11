import React from 'react';
import PropTypes from 'prop-types';
import PackageEdit from 'components/admin/PackageEdit/PackageEdit';

/**
 * todo:
 * 1. Redirect to dashboard if id is not present
 * 2. Execute a SSR query for initial page population from server
 * @param {*} props
 */
const PackagePage = props => {
  const { query: { id } } = props;

  return <PackageEdit id={ id } />;
};

PackagePage.propTypes = {
  query: PropTypes.object,
};

export default PackagePage;
