import React from 'react';
import PropTypes from 'prop-types';
import ApolloError from 'components/errors/ApolloError';
import { Table } from 'semantic-ui-react';

const TableBodyError = props => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>
        <ApolloError error={ props.error } />
      </Table.Cell>
    </Table.Row>
  </Table.Body>
);

TableBodyError.propTypes = {
  error: PropTypes.object
};

export default TableBodyError;
