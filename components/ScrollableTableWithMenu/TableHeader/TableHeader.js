/**
 *
 * TableHeader
 *
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { DashboardContext } from 'context/dashboardContext';

import './TableHeader.scss';

const TableHeader = ( {
  tableHeaders,
  handleSort,
  displayActionsMenu
} ) => {
  const { state } = useContext( DashboardContext );

  return (
    <Table.Header>
      <Table.Row>
        { tableHeaders.map( header => (
          <Table.HeaderCell
            key={ header.name }
            sorted={ state.column === header.name ? state.direction : null }
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
  handleSort: PropTypes.func,
  displayActionsMenu: PropTypes.bool
};

export default TableHeader;
