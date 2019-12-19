import React from 'react';
import PropTypes from 'prop-types';
// import { redirectTo } from 'lib/browser';
import PackageEdit from 'components/admin/PackageEdit/PackageEdit';

/**
 * todo:
 * 1. Redirect to dashboard if id is not present
 * 2. Execute a SSR query for initial page population from server
 * @param {*} props
 */
const PackagePage = props => {
  const {
    query: { id, action }
  } = props;

  return <PackageEdit id={ id } action={ action } />;
};

PackagePage.propTypes = {
  query: PropTypes.object
};

export default PackagePage;
