/**
 *
 * TableHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import './TableHeader.scss';

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
        { tableHeaders.map( header => (
          <Table.HeaderCell
            key={ header.name }
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
  tableHeaders: PropTypes.array.isRequired,
  column: PropTypes.string,
  direction: PropTypes.string,
  handleSort: PropTypes.func,
  displayActionsMenu: PropTypes.bool
};

export default TableHeader;
