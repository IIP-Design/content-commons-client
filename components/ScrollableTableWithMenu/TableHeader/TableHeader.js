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

const TableHeader = ( { handleSort, tableHeaders } ) => {
  const { state } = useContext( DashboardContext );

  const column = state?.column ? state.column : 'createdAt';
  const direction = state?.direction ? state.direction : 'descending';
  const selected = state?.selected ? state.selected : null;

  const displayActionsMenu = selected?.displayActionsMenu ? selected.displayActionsMenu : false;

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
  handleSort: PropTypes.func,
};

export default TableHeader;
