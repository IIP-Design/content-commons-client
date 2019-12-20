import React from 'react';
import { Loader, Table } from 'semantic-ui-react';

const TableBodyLoading = () => (
  <Table.Body>
    <Table.Row>
      <Table.Cell>
        <Loader active inline size="small" />
        <span style={ { marginLeft: '0.5em', fontSize: '1.5em' } }>
          Loading...
        </span>
      </Table.Cell>
    </Table.Row>
  </Table.Body>
);

export default TableBodyLoading;
