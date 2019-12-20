import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

const TableBodyNoResults = props => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>
        No results for &ldquo;{ props.searchTerm }&rdquo;
      </Table.Cell>
    </Table.Row>
  </Table.Body>
);

TableBodyNoResults.propTypes = {
  searchTerm: PropTypes.string
};

export default TableBodyNoResults;
