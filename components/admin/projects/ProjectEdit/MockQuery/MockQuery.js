import React, { Fragment } from 'react';
import { func, object } from 'prop-types';
import { projects as payload } from 'components/admin/projects/ProjectEdit/mockData';

/**
 * A mock Apollo query for development use
 * @param {children} props React component
 * @param {query} props GraphQL query
 */
const MockQuery = props => (
  <Fragment>
    { props.children( props.query( payload, props.variables ) ) }
  </Fragment>
);

MockQuery.propTypes = {
  children: func.isRequired,
  query: func.isRequired,
  variables: object
};

MockQuery.defaultProps = {
  variables: {}
};

export default MockQuery;
