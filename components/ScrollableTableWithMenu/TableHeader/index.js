/**
 *
 * TableHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import './TableHeader.css';

const TableHeader = props => {
  const {
    tableHeaders,
    column,
    direction,
    handleSort,
    displayActionsMenu
  } = props;
  return (
    <Table.Header>
      <Table.Row>
        { tableHeaders.map( ( header, i ) => (
          <Table.HeaderCell
            key={ i }
            sorted={ column === header.name ? direction : null }
            onClick={ handleSort( header.name ) }
            className={ displayActionsMenu ? 'displayActionsMenu' : '' }
          >
            { header.label }
          </Table.HeaderCell>
        ) ) }
      </Table.Row>
    </Table.Header>
  );
};

TableHeader.propTypes = {
  tableHeaders: PropTypes.array,
  column: PropTypes.string,
  direction: PropTypes.string,
  handleSort: PropTypes.func,
  displayActionsMenu: PropTypes.bool
};

export default TableHeader;
