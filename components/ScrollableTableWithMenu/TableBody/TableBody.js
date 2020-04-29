import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { Table } from 'semantic-ui-react';

import TableRow from 'components/ScrollableTableWithMenu/TableRow/TableRow';
import TableBodyMessage from './TableBodyMessage/TableBodyMessage';

import './TableBody.scss';

const TableBody = ( {
  bodyPaginationVars,
  column,
  data,
  direction,
  error,
  loading,
  projectTab,
  searchTerm,
  tableHeaders
} ) => {
  if ( error ) return <TableBodyMessage error={ error } type="error" />;

  // Checks for existing data so loading doesn't flash when resort columns
  if ( loading && !data ) return <TableBodyMessage type="loading" />;

  if ( !data ) return null;
  if ( searchTerm && !data.length ) return <TableBodyMessage searchTerm={ searchTerm } type="no-results" />;
  if ( !data.length ) return <TableBodyMessage type="no-projects" />;

  // No option exisiting in schema to order by author or team
  // When author column is clicked, a query is sent to the server without pagination variables
  // This results in an overfetch that has to be filtered on the the client side
  const order = direction ? `${direction === 'ascending' ? 'asc' : 'desc'}` : 'desc';

  const legacySorting = col => orderBy(
    data,
    tableDatum => {
      const formattedTableDatum = tableDatum[col];

      return formattedTableDatum;
    },
    [order]
  );

  // skip & first query vars are used as start/end slice() params to paginate tableData on client
  const { skip, first } = bodyPaginationVars;
  const paginatedSorting = legacySorting( column ).slice( skip, skip + first );

  const isLegacySort = column === 'author' || column === 'categories' || column === 'team';

  const tableData = isLegacySort ? paginatedSorting : data;

  return (
    <Table.Body className="projects">
      { tableData.map( d => (
        <TableRow
          key={ d.id }
          d={ d }
          tableHeaders={ tableHeaders }
          projectTab={ projectTab }
        />
      ) ) }
    </Table.Body>
  );
};

TableBody.propTypes = {
  bodyPaginationVars: PropTypes.object,
  column: PropTypes.string,
  data: PropTypes.array,
  direction: PropTypes.string,
  error: PropTypes.object,
  loading: PropTypes.bool,
  projectTab: PropTypes.string,
  searchTerm: PropTypes.string,
  tableHeaders: PropTypes.array
};

export default TableBody;

